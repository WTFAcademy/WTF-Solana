import {
  Connection,
  clusterApiUrl,
  GetVersionedBlockConfig
} from "@solana/web3.js";
import bs58 from "bs58";

const connection = new Connection(clusterApiUrl("mainnet-beta"));

(async () => {
  // 1. 获取当前 slot
  const slot = await connection.getSlot();
  console.log("当前 slot:", slot);

  // 2. 获取最新的blockhash和区块高度信息
  const latestBlockhash = await connection.getLatestBlockhash();
  console.log("最新区块hash:", latestBlockhash.blockhash);
  console.log("失效区块高度（当前高度+150）:", latestBlockhash.lastValidBlockHeight);

  // 3. 获取该 Slot 的 Block
  const config: GetVersionedBlockConfig = {
    maxSupportedTransactionVersion: 0,
    rewards: false,
    transactionDetails: "full"
  };
  const block = await connection.getBlock(slot, config);
  console.log("Block内容:", block);

  // 4. 获取该 slot 的 block 时间（Unix 时间戳）
  const timestamp = await connection.getBlockTime(slot);
  if (timestamp !== null) {
    console.log("区块时间:", new Date(timestamp * 1000).toLocaleString());
  } else {
    console.log("无法获取时间戳（可能是跳过 slot）");
  }
})();
