---
title: 2. 创建钱包 & 导入钱包
tags:
  - solana
  - javascript
  - web3js
  - wallet
  - blockchain
---

# WTF Solana Web3.js 极简教程: 2. 创建钱包 & 导入钱包

WTF Solana Web3.js 极简教程属于 WTF Solana 教程的一部分，由 WTF Academy 和 ChainBuff 共同推出。

**推特**：[@0xAA_Science](https://twitter.com/0xAA_Science) ｜ [@WTFAcademy_](https://twitter.com/WTFAcademy_) ｜ [@ChainBuff](https://twitter.com/ChainBuff)

**WTF Academy 社群：** [官网 wtf.academy](https://wtf.academy) | [微信群申请](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link) ｜ [Discord](https://discord.gg/5akcruXrsk)

所有代码和教程开源在 GitHub: [github.com/WTFAcademy/WTF-Solana](https://github.com/WTFAcademy/WTF-Solana)

---

在 Solana 中，每一个钱包都是一个 `Keypair`，由私钥（secretKey）和公钥（publicKey）组成。`@solana/web3.js` 中的 `Keypair` 类提供了创建、导出、导入钱包的能力。

本讲我们将介绍三种操作：
1. 创建一个新钱包
2. 将钱包保存到本地（base58 编码）
3. 从本地导入钱包（从私钥恢复）


## 1. 创建新钱包

```ts
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const wallet = Keypair.generate();

console.log("新钱包创建成功！");
console.log("Public Key:", wallet.publicKey.toBase58());
console.log("Private Key (base58):", bs58.encode(wallet.secretKey));
```

### 输出样例：

```
新钱包创建成功！
Public Key: 9Ujz...WYXh
Private Key (base58): 3rcA...Ttzh
```

> `secretKey` 是 `Uint8Array`，我们通常将其转为 base58 编码后保存。


## 2. 将钱包保存到文件

```ts
import fs from "fs";

const privateKey58 = bs58.encode(wallet.secretKey);
fs.writeFileSync("wallet.txt", privateKey58);
console.log("私钥已保存到 wallet.txt");
```


## 3. 从私钥导入钱包

你可以通过 base58 编码的私钥恢复钱包：

```ts
const savedKey58 = fs.readFileSync("wallet.txt", "utf-8");
const recoveredSecretKey = bs58.decode(savedKey58);
const recoveredWallet = Keypair.fromSecretKey(recoveredSecretKey);

console.log("钱包恢复成功！");
console.log("Recovered Public Key:", recoveredWallet.publicKey.toBase58());
```

### 输出样例：

```
Recovered Public Key: 与原钱包一致 ✅
```


> 请妥善保管你的私钥文件（`wallet.txt`），**不要上传到 GitHub**，也不要暴露在公网。
> 如果你丢失了私钥，那么这个钱包中的资产就丢了。


## 4. 私钥格式说明：数字数组 vs base58 编码

你可能在一些 Solana 钱包导出的示例中看到如下格式的私钥：

```json
[
   57, 112,   7, 145,  39,  71,  23, 123, 242,  25, 253,
  181, 237, 249, 170, 112, 188,  82, 139,  27, 143, 208,
  161,  23,  69, 245, 137,  67, 228,   2, 221,  13,   9,
  112, 247,  27, 171, 133,  86,   0,  75, 209, 228, 223,
  247,  43,   6, 234, 238,  57, 193, 249, 142, 212, 171,
  253, 143, 168,  16, 252, 144, 142, 148, 203
]
```

这是私钥（`secretKey`）的**原始格式**，是 JSON 格式的 `Uint8Array` 数组。

Solana 通常使用 base58 编码（类似比特币地址）来展示私钥，因为它更短、更安全地避免了视觉歧义。

我们可以通过 `bs58` 库来实现两种格式的转换：

```ts
console.log("原始私钥:", wallet.secretKey);
const privateKey58 = bs58.encode(wallet.secretKey);
console.log("Base58 编码后的私钥:", privateKey58);
const decoded = bs58.decode(privateKey58);
console.log("解码后的原始私钥:", Uint8Array.from(decoded));
```

### 输出样例：

```
原始私钥: Uint8Array(64) [
   11,  74, 157, 238, 156,  52, 222,  69,  52, 127, 201,
  185,  56, 143,  67,  18, 234, 102, 198, 188, 194,  53,
  231, 238,  72, 150, 212, 135, 163, 153, 169, 145, 194,
  251, 119, 181,  96, 210,  37, 173, 175, 102,  73,  98,
  221,  89, 122,  52, 219, 241, 220,  50,  48,  69, 100,
   43,  16,  87,  35, 246,  34, 235, 108, 200
]
Base58 编码后的私钥: E6S4WWG3onkuAFPCmPfvnas2hsSQ2APPN6DHBU4bcYB97YmLmc7PxYsjDKh9HyGDJfWqzeu2wLUT2h2nHwji7ao
解码后的原始私钥: Uint8Array(64) [
   11,  74, 157, 238, 156,  52, 222,  69,  52, 127, 201,
  185,  56, 143,  67,  18, 234, 102, 198, 188, 194,  53,
  231, 238,  72, 150, 212, 135, 163, 153, 169, 145, 194,
  251, 119, 181,  96, 210,  37, 173, 175, 102,  73,  98,
  221,  89, 122,  52, 219, 241, 220,  50,  48,  69, 100,
   43,  16,  87,  35, 246,  34, 235, 108, 200
]
```


## 5. 总结

本讲中，我们学习了如何用 Web3.js：

- 创建一个新的 Solana 钱包（Keypair）
- 保存并导出私钥（使用 base58 编码）
- 从私钥导入并恢复钱包

你现在已经能够用代码安全地管理 Solana 钱包了！