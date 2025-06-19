import {
  Connection,
  clusterApiUrl,
  Keypair,
  Transaction,
  SystemProgram,
  ComputeBudgetProgram,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  PublicKey
} from "@solana/web3.js";
import fs from "fs";
import bs58 from "bs58";

// 连接主网
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

// 钱包
const secretKey = bs58.decode(fs.readFileSync("wallet.txt", "utf-8"));
const payer = Keypair.fromSecretKey(secretKey);

// 接收者地址（可以改为你的另一个钱包）
const receiver = new PublicKey("4xxeGf2jZAyLVW1sEELTJy2Fd4hwRerNTDCg8ZQuH4tn");

// 构造优先费指令
const cuLimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 });
const cuPriceIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 10_000 }); // 每 CU 10,000 = 0.00001 SOL

// 普通 SOL 转账指令
const transferIx = SystemProgram.transfer({
  fromPubkey: payer.publicKey,
  toPubkey: receiver,
  lamports: 0.0001 * LAMPORTS_PER_SOL
});

// 构造交易
const tx = new Transaction()
  .add(cuLimitIx)
  .add(cuPriceIx)
  .add(transferIx);

const main = async () => {
  console.log("正在发送交易...");
  const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
  console.log("交易成功！交易哈希:", sig);
  console.log(`查看交易：https://solscan.io/tx/${sig}`);
}

main();