import { Connection, clusterApiUrl, VersionedBlockResponse } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

(async () => {

  // 读取区块
  // 获取最新 slot
  const slot = await connection.getSlot();

  // 获取对应区块
  const block = await connection.getBlock(slot, {
    maxSupportedTransactionVersion: 0,
  });

  if (!block || block.transactions.length === 0) {
    console.log("该区块为空");
  } else {
    console.log(`区块 Slot: ${slot}`);
    console.log("交易数:", block?.transactions.length);
    console.log(`区块信息`);
    console.log(JSON.stringify(block, null, 2));
  }



  // 读取并解析投票交易
  const txSig = "K519gvMJPKpQpXoxYP46oZmAQAiHEvE4JZrJUS5PmbrhAv2eHyvNYP1TNJ4XYgzKx2Q9YJnUHh2pgsynkxfb2CN";
  const parsedTx = await connection.getParsedTransaction(txSig, {
    maxSupportedTransactionVersion: 0,
  });
  console.log(JSON.stringify(parsedTx?.transaction?.message?.instructions, null, 2));
})();