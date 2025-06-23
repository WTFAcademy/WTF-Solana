import {
  Connection,
  Keypair,
  SystemProgram,
  sendAndConfirmTransaction,
  Transaction,
  clusterApiUrl,
  PublicKey,
  AddressLookupTableProgram,
  TransactionMessage,
  VersionedTransaction,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

// 导入 payer 钱包
const payer = Keypair.fromSecretKey(bs58.decode(fs.readFileSync("wallet.txt", "utf-8")));

// 接收者地址（可以改为你的另一个钱包）
const receiver = new PublicKey("4xxeGf2jZAyLVW1sEELTJy2Fd4hwRerNTDCg8ZQuH4tn");


const main = async () => {
  const slot = await connection.getSlot();

  // 使用 createLookupTable 创建 ALT，得到createInst指令和ALT地址
  const [createIx, lookupTableAddress] =
    AddressLookupTableProgram.createLookupTable({
      authority: payer.publicKey,
      payer: payer.publicKey,
      recentSlot: slot,
    });
  
  console.log("ALT地址:", lookupTableAddress.toBase58());

  // 使用 extendLookupTable 在ALT中添加地址，得到extendIx指令
  const extendIx = AddressLookupTableProgram.extendLookupTable({
    lookupTable: lookupTableAddress,
    authority: payer.publicKey,
    payer: payer.publicKey,
    addresses: [
      receiver,
      // 可添加多个，一次最多32个，每个ALT最多包含256个地址
    ],
  });
  
  const tx = new Transaction().add(createIx, extendIx);
  const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
  console.log("交易成功！交易哈希:", sig);
  console.log(`查看交易：https://solscan.io/tx/${sig}`);

  // const lookupTableAddress = new PublicKey("AWBzStFte72MdyqEi4EMBrb8QkwPsyjtkuxiMCt3AZtE");

  const lookupTableAccount = (
    await connection.getAddressLookupTable(lookupTableAddress)
  ).value;
  console.log("ALT账户:", lookupTableAccount);

  // 获取最新的 blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  // 转账指令
  const TransferIx = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: receiver,
    lamports: 0.001 * LAMPORTS_PER_SOL,
  });

  // 创建 v0 message
  const messageV0 = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: blockhash,
    instructions: [TransferIx],
  }).compileToV0Message(lookupTableAccount ? [lookupTableAccount] : []);

  // 创建并发送交易
  const txV0 = new VersionedTransaction(messageV0);
  txV0.sign([payer]);
  const signature = await connection.sendTransaction(txV0);
  console.log("交易已发送，签名:", signature);

  // 等待交易确认
  console.log("等待交易确认...");
  const confirmation = await connection.confirmTransaction(signature, "confirmed");

  if (confirmation.value.err) {
    console.error("交易失败:", confirmation.value.err);
  } else {
    console.log("交易成功确认！");
    console.log("交易签名:", signature);
  }

}
main()