---

title: 7. 读取区块
tags:
 - solana
 - blockchain
 - web3js
 - slot
 - block
 - blockhash

---

# WTF Solana Web3.js 极简教程：第 7 讲：读取区块

WTF Solana Web3.js 极简教程属于 WTF Solana 教程的一部分，由 WTF Academy 和 ChainBuff 共同推出。

**推特**：[@0xAA_Science](https://twitter.com/0xAA_Science) ｜ [@WTFAcademy_](https://twitter.com/WTFAcademy_) ｜ [@ChainBuff](https://twitter.com/ChainBuff)

**WTF Academy 社群：** [官网 wtf.academy](https://wtf.academy) | [微信群申请](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link) ｜ [Discord](https://discord.gg/5akcruXrsk)

所有代码和教程开源在 GitHub: [github.com/WTFAcademy/WTF-Solana](https://github.com/WTFAcademy/WTF-Solana)

---

这一讲，我们将介绍如何读取整个 Solana 区块的交易，俗称“扫块”。

## 1. 读取区块

我们可以使用 `connection.getBlock()` 方法读取指定 `slot` 整个区块的数据。

```ts
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
    console.log(JSON.stringify(block, null, 2));
  }
})();
```

输出的区块信息如下：

```json
区块 Slot: 347230729
{
  "blockHeight": 325437061,
  "blockTime": 1750101068,
  "blockhash": "CNCnv1UqX92PvX4DTs8x5XFPyTKgDPWdaoA3GEuS5SyM",
  "parentSlot": 347230728,
  "previousBlockhash": "8ametgFwLbKJFyAs42T83ko8kJmPBBttsWdcdNp5HScv",
  "rewards": [
    {
      "commission": null,
      "lamports": 120063274,
      "postBalance": 1067173748827,
      "pubkey": "BSVckjdW2f8kcXPGcrPPtV9kUDBZ8w8PjrrGVnxgEdwq",
      "rewardType": "Fee"
    }
  ],
  "transactions": [
    {
      "meta": {
        "computeUnitsConsumed": 2100,
        "err": null,
        "fee": 5000,
        "innerInstructions": [],
        "loadedAddresses": {
          "readonly": [],
          "writable": []
        },
        "logMessages": [
          "Program Vote111111111111111111111111111111111111111 invoke [1]",
          "Program Vote111111111111111111111111111111111111111 success"
        ],
        "postBalances": [
          1067053685553,
          17966495611944,
          1
        ],
        "postTokenBalances": [],
        "preBalances": [
          1067053690553,
          17966495611944,
          1
        ],
        "preTokenBalances": [],
        "rewards": [],
        "status": {
          "Ok": null
        }
      },
      "transaction": {
        "message": {
          "header": {
            "numReadonlySignedAccounts": 0,
            "numReadonlyUnsignedAccounts": 1,
            "numRequiredSignatures": 1
          },
          "accountKeys": [
            "BSVckjdW2f8kcXPGcrPPtV9kUDBZ8w8PjrrGVnxgEdwq",
            "2uXzxR2EZVaHE3CuaDaUJ8C9Qr54LMfwkY5BtRPAzbPE",
            "Vote111111111111111111111111111111111111111"
          ],
          "recentBlockhash": "8ametgFwLbKJFyAs42T83ko8kJmPBBttsWdcdNp5HScv",
          "instructions": [
            {
              "accounts": [
                1,
                0
              ],
              "data": "67MGnDAjriAVs1z7UpVXtuehaGjP4D3HeTmvVRhWRyL3jPtdCpaZ7w7855CVcHAuMANL6waDJNcEZ4rW3cuKf2Cbeeos2UnfKrn56Wu7X7LxPc3Wa4UdVhYaZY1vMsGEPyFXZ2UdjPc5n32kwqvkg6G48LFEo6hgAzXeuQXKrfMZNrGcRQjv5zFY8dfCme2ozHvyVzpY4F",
              "programIdIndex": 2,
              "stackHeight": null
            }
          ],
          "indexToProgramIds": {}
        },
        "signatures": [
          "K519gvMJPKpQpXoxYP46oZmAQAiHEvE4JZrJUS5PmbrhAv2eHyvNYP1TNJ4XYgzKx2Q9YJnUHh2pgsynkxfb2CN"
        ]
      },
      "version": "legacy"
    },
    ... 区块中其他交易,
  ]
}
```

我们可以看到，它主要包含区块元数据和该区块的所有交易。

## 2. 区块元数据

区块元数据包含以下几个字段：

| 字段                  | 含义                                        |
| ------------------- | ----------------------------------------- | 
| `blockHeight`       | 区块的高度（包含区块数）                              | 
| `blockTime`         | 区块时间戳（Unix时间）                             | 
| `blockhash`         | 当前区块哈希                                    | 
| `previousBlockhash` | 上一个区块哈希                                   | 
| `parentSlot`        | 父 slot 编号                                 | 
| `rewards`           | 奖励记录，奖励给验证者的 SOL 收益（如手续费、投票奖励）            | 

上面的区块中，区块高度为 `325437061`，区块时间为 `1750101068`，区块哈希 `CNCnv1UqX92PvX4DTs8x5XFPyTKgDPWdaoA3GEuS5SyM`，上一个Slot `347230728`，上一个区块哈希 `8ametgFwLbKJFyAs42T83ko8kJmPBBttsWdcdNp5HScv`。

出块节点的奖励为 `120063274` lamports，也就是 0.12 SOL，比大家想象的要低吧，哈哈。验证者的公钥 `BSVckjdW2f8kcXPGcrPPtV9kUDBZ8w8PjrrGVnxgEdwq`，收到奖励后的余额为 `1067173748827` lamports（1067 SOL）。

```json
"blockHeight": 325437061,
"blockTime": 1750101068,
"blockhash": "CNCnv1UqX92PvX4DTs8x5XFPyTKgDPWdaoA3GEuS5SyM",
"parentSlot": 347230728,
"previousBlockhash": "8ametgFwLbKJFyAs42T83ko8kJmPBBttsWdcdNp5HScv",
"rewards": [
  {
    "commission": null,
    "lamports": 120063274,
    "postBalance": 1067173748827,
    "pubkey": "BSVckjdW2f8kcXPGcrPPtV9kUDBZ8w8PjrrGVnxgEdwq",
    "rewardType": "Fee"
  }
],
```

## 3. 投票交易

Solana 上一个区块一般会包含上千笔交易。其中有几百比是验证节点的投票交易：提交投票，参与共识。一般我们扫块分析交易时，会把这些交易过滤掉。

> 听说明年 Solana 会更换共识协议，投票会转为链下进行，到时候就不会看到每个区块有这么多的投票交易了。

它的特点是有投票程序账户的参与，地址为 `Vote111111111111111111111111111111111111111`。比如这个区块的第一笔交易，解析后为：

```json
[
  {
    "parsed": {
      "info": {
        "towerSync": {
          "blockId": "11111111111111111111111111111111",
          "hash": "AdsNoEZsXUpxELAiAamDSNm5kVnTwf9Hpqnwttgk9EbP",
          "lockouts": [
            {
              "confirmation_count": 31,
              "slot": 347230698
            },
            {
              "confirmation_count": 30,
              "slot": 347230699
            },
            ...,]
          "root": 347230697,
          "timestamp": 1750101068
        },
        "voteAccount": "2uXzxR2EZVaHE3CuaDaUJ8C9Qr54LMfwkY5BtRPAzbPE",
        "voteAuthority": "BSVckjdW2f8kcXPGcrPPtV9kUDBZ8w8PjrrGVnxgEdwq"
      },
      "type": "towersync"
    },
    "program": "vote",
    "programId": "Vote111111111111111111111111111111111111111",
    "stackHeight": null
  }
]
```

## 4. 总结

这一讲，我们介绍了如何使用 `connection.getBlock()` 读取 Solana 区块数据，包括区块的元数据以及它所包含的所有交易。目前Solana每个区块包含几百条投票交易，一般用不上，需要过滤掉。
