---

title: 8. 订阅
tags:
 - solana
 - blockchain
 - web3js
 - slot
 - block
 - blockhash

---

# WTF Solana Web3.js 极简教程：第 8 讲：订阅

WTF Solana Web3.js 极简教程属于 WTF Solana 教程的一部分，由 WTF Academy 和 ChainBuff 共同推出。

**推特**：[@0xAA_Science](https://twitter.com/0xAA_Science) ｜ [@WTFAcademy_](https://twitter.com/WTFAcademy_) ｜ [@ChainBuff](https://twitter.com/ChainBuff)

**WTF Academy 社群：** [官网 wtf.academy](https://wtf.academy) | [微信群申请](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link) ｜ [Discord](https://discord.gg/5akcruXrsk)

所有代码和教程开源在 GitHub: [github.com/WTFAcademy/WTF-Solana](https://github.com/WTFAcademy/WTF-Solana)

---

在本讲中，我们将介绍如何使用 Web3.js 的订阅功能 `on()` 实时监听 Solana 链上的账户和程序的状态变化。这对于构建响应链上事件的 DApp 或者监控交易行为非常有用。

## 1. 什么是订阅？

Solana 提供了一套 websocket 协议，允许你实时订阅链上状态的变化，比如：

- 某个账户余额变动

- 某个 token 持仓变化

- 某个程序状态变化（比如转账、铸币、销毁）

- slot 新增或区块生成

Web3.js 提供的 `connection.onXXX` 方法就可以使用这些订阅功能。


## 2. 监听账户

我们可以使用 `onAccountChange()` 来监听单个账户的变化，包括账户余额（SOL）、数据（`data`字段）、owner的变化和账户的销毁/新建。

在下面的例子中，我们监听了 pumpfun 的一个手续费账户，感受源源不断的SOL流入！

```ts
// 1. 监听账户 例如余额变化
// 要监听的账户地址（例如 pumpfun 费用地址）
const pubkey = new PublicKey("62qc2CNXwrYqQScmEdiZFFAnJR262PxWEuNQtxfafNgV");

// 注册订阅，感受一下什么叫躺着赚钱
const subscriptionId = connection.onAccountChange(pubkey, (updatedAccountInfo, context) => {
  console.log("账户发生变化！");
  console.log("最新账户信息:", updatedAccountInfo);
  console.log("上下文信息:", context);
});

console.log("开始监听pumpfun账户变化...");
console.log("订阅ID:", subscriptionId);
```

输出

```shell
开始监听pumpfun账户变化...
订阅ID: 0
账户发生变化！
最新SOL余额: 35384.481830327
上下文信息: { slot: 347637363 }
账户发生变化！
最新SOL余额: 35384.500503056
上下文信息: { slot: 347637364 }
账户发生变化！
最新SOL余额: 35384.53421068
上下文信息: { slot: 347637365 }
账户发生变化！
最新SOL余额: 35384.54200533
上下文信息: { slot: 347637366 }
账户发生变化！
最新SOL余额: 35384.59325617
上下文信息: { slot: 347637367 }
```

## 3. 监听程序账户

如果我们要同时监听一个 Program 所有相关账户，可以使用 `onProgramAccountChange()`，它会扫描监听某个 Program 创建的所有账户。比如我们可以监听一个 SPL 代币所有持仓用户的变化，甚至可以同时监听所有 SPL 代币的变化。

下面的代码监听了所有 SPL 代币的相关账户的变化（高能预警）：

```ts
const subscriptionId1 = connection.onProgramAccountChange(
  TOKEN_PROGRAM_ID,
  (keyedAccountInfo) => {
    const accountPubkey = keyedAccountInfo.accountId.toBase58();
    console.log(`代币账户 ${accountPubkey} 更新！`);
    const accountInfo = AccountLayout.decode(keyedAccountInfo.accountInfo.data);
    console.log(`mint ${accountInfo.mint.toBase58()}`);
    console.log(`owner ${accountInfo.owner.toBase58()}`);
    console.log(`amount ${accountInfo.amount}`);
  },
  "confirmed"
);

console.log("开始监听所有token账户变化...");
console.log("订阅ID:", subscriptionId1);
```


输出：

```shell
代币账户 6mhHH6H8z8wdRZN7rCQRSWby7ryXxCMjYWZAptkdmMkV 更新！
mint 3oppL1CY4D6wDofmYyQ1vjmr1A1s1z3yECgw39JJPUMP
owner 8N3GDaZ2iwN65oxVatKTLPNooAVUJTbfiVJ1ahyqwjSk
amount 0
代币账户 2yXNQVpxAQnYJtyQHE1hLvcKhcfgBsprcQbMYLcDKjGT 更新！
mint GMDuV8a7xamMwfykfXDxwkd8fHRZvoEkvBwwQqPBisHS
owner JCRGumoE9Qi5BBgULTgdgTLjSgkCMSbF62ZZfGs84JeU
amount 132621716315
```


我们也可以添加筛选（filter）来选择我们感兴趣的交易。下面的交易监听了所有 PNUT 代币账户的变化。具体细节我们会在介绍 SPL 代币的时候讲解。

```ts
// 2.2 监听 PNUT 代币账户变化
const PNUT_MINT = new PublicKey("2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump"); // PNUT token地址

const subscriptionId2 = connection.onProgramAccountChange(
  TOKEN_PROGRAM_ID,
  (keyedAccountInfo) => {
    const accountPubkey = keyedAccountInfo.accountId.toBase58();
    console.log(`PNUT token账户 ${accountPubkey} 更新！`);
    //console.log(keyedAccountInfo);
    const accountInfo = AccountLayout.decode(keyedAccountInfo.accountInfo.data);
    console.log(`owner ${accountInfo.owner.toBase58()}`);
    console.log(`amount ${accountInfo.amount}`);
  },
  "confirmed",
  [
    {
      memcmp: {
        offset: 0, // token account 中的 mint 地址在 offset 0
        bytes: PNUT_MINT.toBase58(), // 只匹配 PNUT 代币地址
      },
    },
  ]
);

console.log("开始监听 PNUT token 账户变化...");
console.log("订阅ID:", subscriptionId2);
```

输出

```shell
开始监听 PNUT token 账户变化...
订阅ID: 0
PNUT token账户 FPgpQRvCznyw9Bi5qUA6gY5dU13QYdEfSqRpGQF4Mrdi 更新！
owner FPgpQRvCznyw9Bi5qUA6gY5dU13QYdEfSqRpGQF4Mrdi
amount 31013950000
PNUT token账户 Bt5MatqLBgS16qndMzcuqYFgaPtuNmLUAsqnKYJ9uLXs 更新！
owner 6kntKawNmZNKZqUHvRVGKMwp8LQU5upyhht7w1PL7dde
amount 1534315118
PNUT token账户 FPgpQRvCznyw9Bi5qUA6gY5dU13QYdEfSqRpGQF4Mrdi 更新！
owner FPgpQRvCznyw9Bi5qUA6gY5dU13QYdEfSqRpGQF4Mrdi
amount 31013950000
PNUT token账户 Bt5MatqLBgS16qndMzcuqYFgaPtuNmLUAsqnKYJ9uLXs 更新！
owner 6kntKawNmZNKZqUHvRVGKMwp8LQU5upyhht7w1PL7dde
amount 1534315118
```

## 4. 监听日志

你可以使用 `onLogs()` 来监听某个 Program 的日志输出，类似以太坊的事件，但不够结构化。 你可以监听 Solana 上的所有 Program 的日志（量很大）：

```ts
const subscriptionId4 = connection.onLogs(
  // 可选：传入 pubKey 监听特定地址的日志，或传入 'all' 监听所有日志
  "all",
  (logInfo, context) => {
    console.log("日志事件触发！");
    console.log("slot:", context.slot);
    console.log("签名:", logInfo.signature);
    console.log("日志输出:", logInfo.logs);
  },
  "confirmed"
);
```

也可以传入 Program ID，来监听特定 Program 的日志。下面，我们监听 pumpfun 上创建新币的事件：

```ts
const PUMPFUN_PROGRAM_ID = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
const subscriptionId5 = connection.onLogs(
  PUMPFUN_PROGRAM_ID,
  (logInfo, context) => {
    const logs = logInfo.logs || [];
    const hasCreateLog = logs.some(log => log.includes("Instruction: Create"));
    
    if (hasCreateLog) {
      console.log("检测到 PumpFun 创建代币操作！");
      console.log("Slot:", context.slot);
      console.log("Tx Signature:", logInfo.signature);
      console.log("日志输出:", logs);
    }
  },
  "confirmed"
);
```

输出：

```shell
检测到 PumpFun 创建代币操作！
Slot: 347641158
Tx Signature: 5M3RdxBAYraHQH3F45sutxUvWyNK17rUm7CQznnm9E1CxTiZ9NuAiYnGGtSgjXAniRrc7gcQnC6e3fTXd1r51iZb
日志输出: [
  'Program ComputeBudget111111111111111111111111111111 invoke [1]',
  'Program ComputeBudget111111111111111111111111111111 success',
  'Program ComputeBudget111111111111111111111111111111 invoke [1]',
  'Program ComputeBudget111111111111111111111111111111 success',
  ...
]
```

## 5. 监听交易确认

我们可以使用 `onSignature()` 的方法判断交易是否成功上链或失败。这里的签名需要是刚发的交易，一般与 `sendRawTransaction()` 搭配使用。

它的用法跟 `confirmTransaction()` 类似，但前者用 WebSocket 订阅，后者使用 RPC 轮询。

```ts
const subscriptionId6 = connection.onSignature(
  sig,
  (signatureResult, context) => {
    console.log("交易确认！");
    console.log("slot:", context.slot);
    console.log("结果:", signatureResult); // { err: null } 表示成功
  },
  "confirmed"
);
```

## 6. 监听 Slot

我们可以使用 `onSlotChange()` 来监听新 Slot 的到来。因为 Slot 约每 400ms 更新一次，可以用来构建时间驱动的应用逻辑（如定时刷新数据）。

```ts
const subscriptionId7 = connection.onSlotChange((slotInfo) => {
  console.log("新 slot 到来！");
  console.log("slot:", slotInfo.slot);
  console.log("上一个slot:", slotInfo.parent); // 上一个slot
  console.log("root:", slotInfo.root); // 网络已经最终确认的 slot
});

console.log("开始监听 Slot 变化...");
console.log("订阅ID:", subscriptionId7);
```

输出：

```shell
开始监听 Slot 变化...
订阅ID: 0
新 slot 到来！
slot: 347644760
上一个slot: 347644759
root: 347644728
新 slot 到来！
slot: 347644761
上一个slot: 347644760
```

## 7. 停止监听

我们可以使用 `onXXX` 对应的 `removeXXXListener` 来停止监听：

```ts
await connection.removeAccountChangeListener(subscriptionId);
await connection.removeProgramAccountChangeListener(programSubId);
await connection.removeLogsListener(logsSubscriptionId);
await connection.removeSignatureListener(signatureSubId);
await connection.removeSlotChangeListener(slotSubId);
```

## 8. 总结

这一讲，我们介绍了订阅 Solana 链上数据的方法，包括监听账户/程序账户/日志/签名/Slot的变化。大家可以利用这些方法实时监听钱包余额变动、新币的发行、token持仓变化等事件。你会用它做什么呢？