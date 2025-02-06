import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
const main = async () => {
    const publicKey = new PublicKey("mpa4abUkjQoAvPzREkh5Mo75hZhPFQ2FSH6w7dWKuQ5");
    const balance = await connection.getBalance(publicKey);
    // 输出API URL
    console.log(`API URL: ${clusterApiUrl("mainnet-beta")}`);
    // 输出LAMPORTS_PER_SOL
    console.log(`LAMPORTS PER SOL: ${LAMPORTS_PER_SOL}`);
    // 输出SOL余额
    console.log(`SOL Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}

main();