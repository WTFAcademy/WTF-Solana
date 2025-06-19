import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";

// 连接主网
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

// 从本地导入发送者私钥（请确保保密）
const secretKeyBase58 = fs.readFileSync("wallet.txt", "utf-8");
const sender = Keypair.fromSecretKey(bs58.decode(secretKeyBase58));

// 接收者地址（可以改为你的另一个钱包）
const receiver = new PublicKey("4xxeGf2jZAyLVW1sEELTJy2Fd4hwRerNTDCg8ZQuH4tn");

const main = async () => {
  const instruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: receiver,
    lamports: 0.001 * LAMPORTS_PER_SOL,
  });
  
  // 创建交易
  const transaction = new Transaction().add(instruction);
  
  // 获取最新的 blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = sender.publicKey;
  
  // 签名交易
  transaction.sign(sender);
  
  // 序列化交易，转换为Buffer类型
  const serializedTransaction = transaction.serialize();
  
  // 使用 sendRawTransaction 发送交易
  console.log("正在发送交易...");
  const signature = await connection.sendRawTransaction(serializedTransaction, {
    skipPreflight: true, // 是否跳过预检查，用于加速
    preflightCommitment: "confirmed", // 预检查的确认级别
    maxRetries: 0, // 最大重试次数
  });
  
  console.log("交易已发送，签名:", signature);

  // 使用 onSignature 监听交易确认
  console.log("开始监听交易确认...");
  const subscriptionId = connection.onSignature(
    signature,
    (signatureResult, context) => {
      console.log("\n=== 交易确认回调 ===");
      console.log("交易签名:", signature);
      console.log("Slot:", context.slot);
      
      if (signatureResult.err) {
        console.error("onSignature: 交易失败:", signatureResult.err);
      } else {
        console.log("onSignature: 交易成功确认！");
        console.log("onSignature: 确认结果:", signatureResult);
      }
      
      // 取消订阅
      connection.removeSignatureListener(subscriptionId);
      console.log("onSignature: 已取消交易确认监听");
    },
    "confirmed" // 确认级别
  );

  console.log("监听器已注册，订阅ID:", subscriptionId);
  
  // 同时使用传统的 confirmTransaction 方法作为备用
  console.log("等待交易确认（备用方法）...");
  const confirmation = await connection.confirmTransaction(signature, "confirmed");
  
  if (confirmation.value.err) {
    console.error("交易失败:", confirmation.value.err);
  } else {
    console.log("交易成功确认！");
    console.log("交易签名:", signature);
  }
};

main();