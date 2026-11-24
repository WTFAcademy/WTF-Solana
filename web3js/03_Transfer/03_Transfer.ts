import {
    Connection,
    clusterApiUrl,
    Keypair,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
  } from "@solana/web3.js";
  import bs58 from "bs58";
  import fs from "fs";
  
  // 连接主网
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
  
  // 从本地导入发送者私钥（请确保保密）
  const secretKeyBase58 = fs.readFileSync("wallet.txt", "utf-8");
  const sender = await Keypair.fromSecretKey(bs58.decode(secretKeyBase58));
  
  // 接收者地址（可以改为你的另一个钱包）
  const receiver = new PublicKey("4xxeGf2jZAyLVW1sEELTJy2Fd4hwRerNTDCg8ZQuH4tn");
  
  const main = async () => {
    // 1. 打印当前发送者余额
    const balance = await connection.getBalance(sender.publicKey);
    console.log(`💰 当前余额: ${Number(balance) / LAMPORTS_PER_SOL} SOL`);
  
    // 2. 构建转账指令（0.001 SOL）
    const instruction = SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: receiver,
      lamports: 0.001 * LAMPORTS_PER_SOL,
    });
  
    // 3. 创建交易
    const transaction = new Transaction().add(instruction);
  
    console.log("recentBlockhash", transaction.recentBlockhash);
    console.log("lastValidBlockHeight", transaction.lastValidBlockHeight);
    console.log("nonceInfo", transaction.nonceInfo);

    // 4. 模拟交易
    const simulateResult = await connection.simulateTransaction(transaction, [sender]);
    console.log("模拟交易结果: ", simulateResult);
  
    // 5. 发送交易
    console.log("正在发送交易...");
    const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);
  
    console.log("交易成功！交易哈希:", signature);
    console.log(`查看交易：https://solscan.io/tx/${signature}?cluster=mainnet-beta`);
  };
  
  main();