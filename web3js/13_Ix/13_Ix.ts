import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  TransactionInstruction
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

const transferIx = async () => {
  // 1. 打印当前发送者余额
  const balance = await connection.getBalance(sender.publicKey);
  console.log(`当前余额: ${balance / LAMPORTS_PER_SOL} SOL`);

  // 2. 构建转账指令的Buffer
  const data = Buffer.alloc(12); // u32 + u64 = 4 + 8 = 12 字节
  data.writeUInt32LE(2, 0);      // instruction index: 2 (Transfer)
  data.writeBigUInt64LE(BigInt(0.001 * LAMPORTS_PER_SOL), 4); // lamports 写入 offset=4 开始的位置
  console.log("data", data);

  // 3. 使用 TransactionInstruction 构建转账指令（0.001 SOL）
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: sender.publicKey, isSigner: true, isWritable: true },
      { pubkey: receiver, isSigner: false, isWritable: true },
    ],
    programId: SystemProgram.programId,
    data: data
  });
    
  // 4. 创建交易
  const transaction = new Transaction().add(instruction);

  // 5. 发送交易
  console.log("正在发送交易...");
  const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);

  console.log("交易成功！交易哈希:", signature);
  console.log(`查看交易：https://solscan.io/tx/${signature}?cluster=mainnet-beta`);
};

const main = async () => {
  await transferIx();
};

main();