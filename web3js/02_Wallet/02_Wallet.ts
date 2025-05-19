import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";

const wallet = Keypair.generate();

console.log("新钱包创建成功！");
console.log("Public Key:", wallet.publicKey.toBase58());
console.log("Private Key (base58):", bs58.encode(wallet.secretKey));


// Base58 和 原始私钥
console.log("原始私钥:", wallet.secretKey);
const privateKey58 = bs58.encode(wallet.secretKey);
console.log("Base58 编码后的私钥:", privateKey58);
const decoded = bs58.decode(privateKey58);
console.log("解码后的原始私钥:", Uint8Array.from(decoded));

