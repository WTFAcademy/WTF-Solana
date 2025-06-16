import { Connection, clusterApiUrl, VersionedBlockResponse } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

// 替换为你想查询的交易哈希
const txSig = "3vr9oZwTcdbLGJfMEX5auy82FFScMBfb5fzfj5SELMqzGuCCNqPV44QsE8rQVTTTmbqTenM1Eogh7aaeN1jnup8g";

(async () => {
  // 读取单笔交易
  const tx = await connection.getTransaction(txSig, {
    maxSupportedTransactionVersion: 0,
  });
  console.log(JSON.stringify(tx, null, 2));

  // 读取单笔交易详情（交易指令解析）
  const parsedTx = await connection.getParsedTransaction(txSig, {
    maxSupportedTransactionVersion: 0,
  });
  console.log(JSON.stringify(parsedTx?.transaction?.message?.instructions, null, 2));
})();
