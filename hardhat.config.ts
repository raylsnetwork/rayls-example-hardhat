import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const RPC_URL = process.env.RPC_URL || "";
const CHAIN_ID = process.env.CHAIN_ID ? Number(process.env.CHAIN_ID) : 0;

// NUNCA commitar chaves. Elas ficam só no .env local (que já está no .gitignore).
const PRIVATE_KEY_OWNER = process.env.PRIVATE_KEY_OWNER || "";
const PRIVATE_KEY_USER_A = process.env.PRIVATE_KEY_USER_A || "";
const PRIVATE_KEY_USER_B = process.env.PRIVATE_KEY_USER_B || "";

// Hardhat costuma exigir private key como 0x + 64 hex
const with0x = (k: string) => (k.startsWith("0x") ? k : `0x${k}`);
const accounts = [PRIVATE_KEY_OWNER, PRIVATE_KEY_USER_A, PRIVATE_KEY_USER_B]
  .filter(Boolean)
  .map(with0x);

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    rayls_devnet: {
      url: RPC_URL,
      chainId: CHAIN_ID,
      accounts,
    },
  },
};

export default config;
