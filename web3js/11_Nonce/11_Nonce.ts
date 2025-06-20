import {
  Connection,
  Keypair,
  SystemProgram,
  sendAndConfirmTransaction,
  Transaction,
  NONCE_ACCOUNT_LENGTH,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

// 导入 payer 钱包
const payer = Keypair.fromSecretKey(bs58.decode(fs.readFileSync("wallet.txt", "utf-8")));

// 接收者地址（可以改为你的另一个钱包）
const receiver = new PublicKey("4xxeGf2jZAyLVW1sEELTJy2Fd4hwRerNTDCg8ZQuH4tn");

// 创建 nonce account
const nonceAccount = Keypair.generate();
const noncePubkey = nonceAccount.publicKey;

const main = async () => {
  // 创建交易（用 SystemProgram 初始化）
  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: noncePubkey,
      lamports: 0.0015 * LAMPORTS_PER_SOL, // connection.getMinimumBalanceForRentExemption(NONCE_ACCOUNT_LENGTH),
      space: NONCE_ACCOUNT_LENGTH,
      programId: SystemProgram.programId,
    }),
    SystemProgram.nonceInitialize(
      {
        noncePubkey: noncePubkey,
        authorizedPubkey: payer.publicKey,
      }
    )
  );

  const sig = await sendAndConfirmTransaction(connection, tx, [payer, nonceAccount]);
  console.log("交易成功！交易哈希:", sig);
  console.log(`查看交易：https://solscan.io/tx/${sig}`);
  console.log("Nonce Account:", noncePubkey.toBase58());
  
  //const noncePubkey = new PublicKey("G7gi24bBCtrMchbN7uRWm2Yzk9fAW641etQrJj45Gaz5");

  const info = await connection.getNonce(noncePubkey);
  console.log("当前 nonce (blockhash):", info?.nonce);

  // 构造交易：nonce advance + transfer
  const advanceIx = SystemProgram.nonceAdvance({
    noncePubkey: noncePubkey,
    authorizedPubkey: payer.publicKey,
  });

  const transferIx = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: receiver, 
    lamports: 0.0001 * LAMPORTS_PER_SOL,
  });

  const tx2 = new Transaction().add(advanceIx).add(transferIx);

  // 使用 durable nonce 而非最新 blockhash
  tx2.recentBlockhash = info?.nonce;
  tx2.feePayer = payer.publicKey;

  tx2.sign(payer); // 必须由 nonce authority 签名

  const serialized = tx2.serialize();

  // 可离线保存后广播
  const sig2 = await connection.sendRawTransaction(serialized);
  console.log("广播成功，交易哈希:", sig2);

  const info2 = await connection.getNonce(noncePubkey);
  console.log("更新后的 nonce (blockhash):", info2?.nonce);

}
main()