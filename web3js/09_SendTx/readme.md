---
title: 9. 发送交易
tags:
 - solana
 - blockchain
 - web3js
 - transaction
 - computeunit
 - CU
---

# WTF Solana Web3.js 极简教程：第 9 讲：发送交易

WTF Solana Web3.js 极简教程属于 WTF Solana 教程的一部分，由 WTF Academy 和 ChainBuff 共同推出。

**推特**：[@0xAA_Science](https://twitter.com/0xAA_Science) ｜ [@WTFAcademy_](https://twitter.com/WTFAcademy_) ｜ [@ChainBuff](https://twitter.com/ChainBuff)

**WTF Academy 社群：** [官网 wtf.academy](https://wtf.academy) | [微信群申请](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link) ｜ [Discord](https://discord.gg/5akcruXrsk)

所有代码和教程开源在 GitHub: [github.com/WTFAcademy/WTF-Solana](https://github.com/WTFAcademy/WTF-Solana)

---

在本讲中，我们将再次介绍两种不同的发送交易的方法 `sendAndConfirmTransaction()` 和 `sendRawTransaction()`。

## 1. sendAndConfirmTransaction

在第3讲，我们使用 `sendAndConfirmTransaction()` 方法发送交易。它是最常用的方法，因为它封装了：

- 交易构造（包含 blockhash）
- 签名
- 发送交易
- 等待确认

```ts
const instruction = SystemProgram.transfer({
  fromPubkey: sender.publicKey,
  toPubkey: receiver,
  lamports: 0.001 * LAMPORTS_PER_SOL,
});

const transaction = new Transaction().add(instruction);
console.log("正在发送交易...");
const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);
```

## 2. sendRawTransaction

还有另一种更底层的发送交易的方法 `sendRawTransaction`，需要你手动处理签名、blockhash 等，我们在第5讲演示过一次。下面的代码可以做到 `sendAndConfirmTransaction` 的功能：

```ts
const instruction = SystemProgram.transfer({
  fromPubkey: sender.publicKey,
  toPubkey: receiver,
  lamports: 0.001 * LAMPORTS_PER_SOL,
});

// 创建交易
const transaction = new Transaction().add(instruction);

// 获取最新的 blockhash
const { blockhash } = await connection.getLatestBlockhash();
transaction.recentBlockhash = blockhash;
transaction.feePayer = sender.publicKey;

// 签名交易
transaction.sign(sender);

// 序列化交易，转换为Buffer类型
const serializedTransaction = transaction.serialize();

// 使用 sendRawTransaction 发送交易
console.log("正在发送交易...");
const signature = await connection.sendRawTransaction(serializedTransaction, {
  skipPreflight: true, // 是否跳过预检查，用于加速
  preflightCommitment: "confirmed", // 预检查的确认级别
  maxRetries: 0, // 最大重试次数
});

console.log("交易已发送，签名:", signature);

// 8. 等待交易确认
console.log("等待交易确认...");
const confirmation = await connection.confirmTransaction(signature, "confirmed");

if (confirmation.value.err) {
  console.error("交易失败:", confirmation.value.err);
} else {
  console.log("交易成功确认！");
  console.log("交易签名:", signature);
}
```

输出：

```shell
正在发送交易...
交易已发送，签名: 2yR43x1FKzQMmb2vVz6Qaf11tBtfbpavgC4UckVFghohny4dkTSqLVBHcEshEHD4FGkFuYGaS6dfvcTWbJxxi3Uk
等待交易确认...
交易成功确认！
交易签名: 2yR43x1FKzQMmb2vVz6Qaf11tBtfbpavgC4UckVFghohny4dkTSqLVBHcEshEHD4FGkFuYGaS6dfvcTWbJxxi3Uk
```

代码复杂了很多，但这样可以更好的控制和优化签名和交易的过程。

我们也可以利用上一讲介绍的 `onSignature` 来监听交易上链，这个方法速度更快。

```ts
  // 使用 onSignature 监听交易确认
  console.log("开始监听交易确认...");
  const subscriptionId = connection.onSignature(
    signature,
    (signatureResult, context) => {
      console.log("\n=== 交易确认回调 ===");
      console.log("交易签名:", signature);
      console.log("Slot:", context.slot);
      
      if (signatureResult.err) {
        console.error("onSignature: 交易失败:", signatureResult.err);
      } else {
        console.log("onSignature: 交易成功确认！");
        console.log("onSignature: 确认结果:", signatureResult);
      }
      
      // 取消订阅
      connection.removeSignatureListener(subscriptionId);
      console.log("onSignature: 已取消交易确认监听");
    },
    "confirmed" // 确认级别
  );

  console.log("监听器已注册，订阅ID:", subscriptionId);
```

输出：

```shell
开始监听交易确认...
监听器已注册，订阅ID: 0
等待交易确认（备用方法）...

=== 交易确认回调 ===
交易签名: 2yR43x1FKzQMmb2vVz6Qaf11tBtfbpavgC4UckVFghohny4dkTSqLVBHcEshEHD4FGkFuYGaS6dfvcTWbJxxi3Uk
Slot: 347682512
onSignature: 交易成功确认！
onSignature: 确认结果: { err: null }
onSignature: 已取消交易确认监听
```

## 3. 总结

这一讲，我们介绍了两种不同的发送交易的方法 `sendAndConfirmTransaction()` 和 `sendRawTransaction()`，并使用 `confirmTransaction` 和 `onSignature` 两种不同的方法等待交易的确认。`sendAndConfirmTransaction()` 封装了交易构造/签名/发送交易/等待确认这些过程，是更常用的方法。