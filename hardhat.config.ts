import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    rayls_devnet: {
      url: process.env.RPC_URL || "https://devnet-rpc.rayls.com",
      chainId: 123123,
      accounts: [
        process.env.PRIVATE_KEY_OWNER!,
        process.env.PRIVATE_KEY_USER_A!,
        process.env.PRIVATE_KEY_USER_B!,
      ].filter(Boolean) as string[],
    },
    rayls: {
      url: "https://devnet-rpc.rayls.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 123123, // Update this if you know the actual chain ID
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
  etherscan: {
    apiKey: {
      rayls: "no-api-key-needed",
    },
    customChains: [
      {
        network: "rayls",
        chainId: 123123,
        urls: {
          apiURL: "https://devnet-explorer.rayls.com/api",
          browserURL: "https://devnet-explorer.rayls.com"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
