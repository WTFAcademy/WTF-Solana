import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";

const wallet = Keypair.generate();
console.log("Public Key:", wallet.publicKey.toBase58());

const privateKey58 = bs58.encode(wallet.secretKey);
fs.writeFileSync("wallet.txt", privateKey58, { flag: "wx", mode: 0o600 });

const savedKey58 = fs.readFileSync("wallet.txt", "utf-8");
const recoveredWallet = Keypair.fromSecretKey(bs58.decode(savedKey58));
console.log("Recovered Public Key:", recoveredWallet.publicKey.toBase58());
