import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, AccountLayout} from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

// 1. 监听账户 例如余额变化
// 要监听的账户地址（例如 pumpfun 费用地址）
// const pubkey = new PublicKey("62qc2CNXwrYqQScmEdiZFFAnJR262PxWEuNQtxfafNgV");

// // 注册订阅，感受一下什么叫躺着赚钱
// const subscriptionId = connection.onAccountChange(pubkey, (updatedAccountInfo, context) => {
//   console.log("账户发生变化！");
//   console.log("最新SOL余额:", updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
//   console.log("上下文信息:", context);
// });

// console.log("开始监听pumpfun账户变化...");
// console.log("订阅ID:", subscriptionId);



// 2. 监听代币账户变化
// 2.1 监听所有代币账户变化
// const subscriptionId1 = connection.onProgramAccountChange(
//   TOKEN_PROGRAM_ID,
//   (keyedAccountInfo) => {
//     const accountPubkey = keyedAccountInfo.accountId.toBase58();
//     console.log(`代币账户 ${accountPubkey} 更新！`);
//     const accountInfo = AccountLayout.decode(keyedAccountInfo.accountInfo.data);
//     console.log(`mint ${accountInfo.mint.toBase58()}`);
//     console.log(`owner ${accountInfo.owner.toBase58()}`);
//     console.log(`amount ${accountInfo.amount}`);
//   },
//   "confirmed"
// );

// console.log("开始监听所有token账户变化...");
// console.log("订阅ID:", subscriptionId1);

// // 2.2 监听 PNUT 代币账户变化
// const PNUT_MINT = new PublicKey("2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump"); // PNUT token地址

// const subscriptionId2 = connection.onProgramAccountChange(
//   TOKEN_PROGRAM_ID,
//   (keyedAccountInfo) => {
//     const accountPubkey = keyedAccountInfo.accountId.toBase58();
//     console.log(`PNUT token账户 ${accountPubkey} 更新！`);
//     //console.log(keyedAccountInfo);
//     const accountInfo = AccountLayout.decode(keyedAccountInfo.accountInfo.data);
//     console.log(`owner ${accountInfo.owner.toBase58()}`);
//     console.log(`amount ${accountInfo.amount}`);
//   },
//   "confirmed",
//   [
//     {
//       memcmp: {
//         offset: 0, // token account 中的 mint 地址在 offset 0
//         bytes: PNUT_MINT.toBase58(), // 只匹配 PNUT 代币地址
//       },
//     },
//   ]
// );

// console.log("开始监听 PNUT token 账户变化...");
// console.log("订阅ID:", subscriptionId2);

// 3. 监听日志
// 3.1 监听所有日志
// const subscriptionId4 = connection.onLogs(
//   // 可选：传入 pubKey 监听特定地址的日志，或传入 'all' 监听所有日志
//   "all",
//   (logInfo, context) => {
//     console.log("日志事件触发！");
//     console.log("slot:", context.slot);
//     console.log("签名:", logInfo.signature);
//     console.log("日志输出:", logInfo.logs);
//   },
//   "confirmed"
// );

// 3.2 监听 PumpFun 代币创建日志，筛选包含 "Instruction: Create"
// const PUMPFUN_PROGRAM_ID = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
// const subscriptionId5 = connection.onLogs(
//   PUMPFUN_PROGRAM_ID,
//   (logInfo, context) => {
//     const logs = logInfo.logs || [];
//     const hasCreateLog = logs.some(log => log.includes("Instruction: Create"));
    
//     if (hasCreateLog) {
//       console.log("检测到 PumpFun 创建代币操作！");
//       console.log("Slot:", context.slot);
//       console.log("Tx Signature:", logInfo.signature);
//       console.log("日志输出:", logs);
//     }
//   },
//   "confirmed"
// );


// // 4. 监听交易确认
// const sig = "3vr9oZwTcdbLGJfMEX5auy82FFScMBfb5fzfj5SELMqzGuCCNqPV44QsE8rQVTTTmbqTenM1Eogh7aaeN1jnup8g"; // 替换成你的交易签名

// const subscriptionId6 = connection.onSignature(
//   sig,
//   (signatureResult, context) => {
//     console.log("交易确认！");
//     console.log("slot:", context.slot);
//     console.log("结果:", signatureResult); // { err: null } 表示成功
//   },
//   "confirmed"
// );



// 5. 监听 Slot
const subscriptionId7 = connection.onSlotChange((slotInfo) => {
  console.log("新 slot 到来！");
  console.log("slot:", slotInfo.slot);
  console.log("上一个slot:", slotInfo.parent); // 上一个slot
  console.log("root:", slotInfo.root); // 网络已经最终确认的 slot
});

console.log("开始监听 Slot 变化...");
console.log("订阅ID:", subscriptionId7);

