---
title: 1. Hello Solana
tags:
  - solana
  - javascript
  - web3js
  - frontend
  - blockchain
---

# WTF Solana Web3.js 极简教程: 1. Hello Solana

WTF Solana Web3.js极简教程属于 WTF Solana 教程的一部分，由 WTF Academy 和 ChainBuff 共同推出。

**推特**：[@0xAA_Science](https://twitter.com/0xAA_Science) ｜ [@WTFAcademy_](https://twitter.com/WTFAcademy_) ｜ [@ChainBuff](https://twitter.com/ChainBuff)

**WTF Academy社群：** [官网 wtf.academy](https://wtf.academy) | [微信群申请](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link) ｜ [Discord](https://discord.gg/5akcruXrsk)

所有代码和教程开源在GitHub: [github.com/WTFAcademy/WTF-Solana](https://github.com/WTFAcademy/WTF-Solana)

-----

这一讲，我们会介绍Solana的web3.js库，并学习如何在前端中使用web3.js读取Solana上指定地址的SOL余额。

## Solana web3.js简述

Solana web3.js是一个完整而简洁的库，可以让开发者便捷地与Solana区块链交互，与以太坊的ethers.js库类似。

你需要使用npm安装web3.js库：

```bash
npm install @solana/web3.js@1.98.0
```

## Hello Solana

现在，让我们写一个简单的javascript程序 `HelloSolana`，查询给定Solana地址的SOL余额并输出到控制台。

```javascript
import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
// 输出API URL
console.log(`API URL: ${clusterApiUrl("mainnet-beta")}`);

// 输出LAMPORTS_PER_SOL
console.log(`LAMPORTS PER SOL: ${LAMPORTS_PER_SOL}`);

const main = async () => {
    const publicKey = new PublicKey("mpa4abUkjQoAvPzREkh5Mo75hZhPFQ2FSH6w7dWKuQ5");
    const balance = await connection.getBalance(publicKey);
    // 输出SOL余额
    console.log(`SOL Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}

main();
```

下面我们逐行分析代码

### 1. 导入Solana web3.js库

```javascript
import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
```

### 2. 设置RPC连接

Web3js中的 `Connection` 类是与Solana区块链交互的核心类，它提供了多种方法来与区块链进行交互，既可以读取链上信息，也可以通过发送交易写入信息。

通过给定RPC端口和确认级别，我们可以创建一个Connection实例。

```javascript
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
// 输出API URL
console.log(`API URL: ${clusterApiUrl("mainnet-beta")}`);
// output: https://api.mainnet-beta.solana.com
```

其中 `mainnet-beta` 是Solana官方提供的主网RPC端口，为 `https://api.mainnet-beta.solana.com`，`confirmed` 是默认的确认级别。

> `processed` 是较低的确认级别，意味着查询的数据是经过验证但尚未完全确认的。`confirmed` 表示节点已经将交易写入区块链，但也不一定被最终确认。如果需要更高的确认级别，可以使用 `finalized`。

### 3. 查询余额

我们可以使用 `Connection` 类中的 `getBalance` 方法查询指定地址的SOL余额：

```javascript
const main = async () => {
    const publicKey = new PublicKey("mpa4abUkjQoAvPzREkh5Mo75hZhPFQ2FSH6w7dWKuQ5");
    const balance = await connection.getBalance(publicKey);
    // 输出SOL余额
    console.log(`SOL Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}

main();
```

> `PublicKey` 类可创建Solana公钥对象。
> `LAMPORTS_PER_SOL` 是Solana的Lamport单位（类似于以太坊中的gwei），1 SOL = 10^9 Lamport。

通过 `ts-node 01_HelloSolana.ts` 运行程序，输出结果如下：

```bash
API URL: https://api.mainnet-beta.solana.com
LAMPORTS PER SOL: 1000000000
SOL Balance: 48.307267292 SOL
```

## 总结

这是WTF Solana Web3.js极简教程的第一讲，我们介绍了web3.js，并写了一个简单的HelloSolana程序，用于查询指定地址的SOL余额。

