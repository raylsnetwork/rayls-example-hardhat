# Rayls Blockchain - Hardhat Example Project

This is a complete example project for deploying and interacting with smart contracts on the **Rayls blockchain**, an EVM-compatible Layer 1 blockchain. This project demonstrates how to develop, test, and deploy an ERC20 token using Hardhat and TypeScript.

## Table of Contents
sdasd
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Smart Contracts](#smart-contracts)
- [Compilation](#compilation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contract Verification](#contract-verification)
- [Interacting with Deployed Contracts](#interacting-with-deployed-contracts)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

---

## Overview

This project includes:

- **RaylsToken**: An ERC20 token contract with mint and burn capabilities
- Comprehensive test suite using Hardhat and Chai
- TypeScript configuration for type safety
- Deployment scripts for Rayls devnet
- Complete documentation and examples

### Features

- ✅ ERC20 standard compliant token
- ✅ Ownable pattern for access control
- ✅ Mint function (owner only)
- ✅ Burn function (any holder)
- ✅ Full test coverage
- ✅ TypeScript support
- ✅ Ready for Rayls blockchain deployment

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** (v9.x or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

You'll also need:

- A wallet with a private key for deploying contracts
- Some native tokens on the Rayls devnet for gas fees

---

## Project Structure

```
rayls-example-hardhat/
├── contracts/               # Solidity smart contracts
│   └── RaylsToken.sol      # ERC20 token contract
├── scripts/                 # Deployment scripts
│   └── deploy.ts           # Deployment script for RaylsToken
├── test/                    # Test files
│   └── RaylsToken.test.ts  # Comprehensive tests for RaylsToken
├── hardhat.config.ts        # Hardhat configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Project dependencies
├── .env.example             # Example environment variables
└── .gitignore              # Git ignore rules
```

---

## Installation

1. **Clone the repository** (or download the project):

```bash
git clone <your-repo-url>
cd rayls-example-hardhat
```

2. **Install dependencies**:

```bash
npm install
```

This will install all required packages including:
- Hardhat
- TypeScript
- Ethers.js v6
- OpenZeppelin Contracts
- Testing utilities

---

## Configuration

### 1. Environment Variables

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

### 2. Set Your Private Key

Edit the `.env` file and add your wallet's private key:

```env
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
```

**⚠️ SECURITY WARNING:**
- **NEVER** commit your `.env` file to version control
- **NEVER** share your private key with anyone
- Use a dedicated wallet for development/testing
- Ensure the `.env` file is listed in `.gitignore`

### 3. Get Test Funds

To deploy contracts on Rayls devnet, you'll need native tokens for gas fees:

1. Create a wallet or use an existing one
2. Get your wallet address
3. Request test tokens from the Rayls faucet (check Rayls documentation for faucet URL)
4. Verify your balance before deploying

### 4. Network Configuration

The project is pre-configured for Rayls devnet in `hardhat.config.ts`:

```typescript
rayls: {
  url: "https://devnet-rpc.rayls.com",
  accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  chainId: 123123,
}
```

---

## Smart Contracts

### RaylsToken (ERC20)

Located in `contracts/RaylsToken.sol`, this contract implements:

#### Key Features:

- **ERC20 Standard**: Fully compliant with the ERC20 token standard
- **Name**: "Rayls Token"
- **Symbol**: "RAYLS"
- **Decimals**: 18
- **Initial Supply**: Configurable during deployment (default: 1,000,000 tokens)

#### Functions:

| Function | Access | Description |
|----------|--------|-------------|
| `transfer(to, amount)` | Public | Transfer tokens to another address |
| `approve(spender, amount)` | Public | Approve spender to use your tokens |
| `transferFrom(from, to, amount)` | Public | Transfer tokens on behalf of another address |
| `mint(to, amount)` | Owner only | Create new tokens |
| `burn(amount)` | Public | Destroy your own tokens |
| `balanceOf(account)` | View | Check token balance |
| `totalSupply()` | View | Get total token supply |

#### Inherited Contracts:

- `ERC20`: Base ERC20 implementation from OpenZeppelin
- `ERC20Burnable`: Adds burn functionality
- `Ownable`: Access control for administrative functions

---

## Compilation

Compile all smart contracts:

```bash
npm run compile
```

This command:
- Compiles all `.sol` files in the `contracts/` directory
- Generates TypeScript types in `typechain-types/`
- Creates artifacts in `artifacts/`
- Optimizes bytecode with 200 runs

**Expected output:**
```
Compiled 1 Solidity file successfully
```

---

## Testing

Run the complete test suite:

```bash
npm test
```

The test suite covers:

- ✅ Deployment and initialization
- ✅ Token transfers between accounts
- ✅ Minting new tokens (owner only)
- ✅ Burning tokens
- ✅ Approval and allowance mechanisms
- ✅ Edge cases and error conditions

**Expected output:**
```
  RaylsToken
    Deployment
      ✓ Should set the right name and symbol
      ✓ Should set the right decimals
      ✓ Should assign the total supply to the owner
      ✓ Should set the right owner
    Transfers
      ✓ Should transfer tokens between accounts
      ✓ Should fail if sender doesn't have enough tokens
      ✓ Should update balances after transfers
    Minting
      ✓ Should allow owner to mint tokens
      ✓ Should not allow non-owner to mint tokens
    Burning
      ✓ Should allow token holders to burn their tokens
      ✓ Should not allow burning more tokens than balance
    Approval and Allowance
      ✓ Should approve tokens for delegated transfer
      ✓ Should allow approved spender to transfer tokens
      ✓ Should not allow transfer more than approved amount

  14 passing
```

---

## Deployment

### Deploy to Rayls Devnet

1. **Ensure you have configured your `.env` file** with your private key

2. **Verify you have test tokens** for gas fees

3. **Run the deployment script**:

```bash
npm run deploy
```

This runs: `hardhat run scripts/deploy.ts --network rayls`

### Deployment Process

The deployment script will:

1. Connect to Rayls devnet RPC
2. Display the deployer's address and balance
3. Deploy the RaylsToken contract with 1,000,000 initial tokens
4. Wait for deployment confirmation
5. Display contract details and address

**Example output:**

```
Starting deployment...
Deploying contracts with the account: 0x1234...5678
Account balance: 10.5 ETH

Initial supply: 1000000.0 tokens

Deploying RaylsToken contract...

✅ RaylsToken deployed successfully!
Contract address: 0xabcd...ef01
Transaction hash: 0x9876...4321

📋 Contract Details:
Name: Rayls Token
Symbol: RAYLS
Decimals: 18
Total Supply: 1000000.0
Owner Balance: 1000000.0
Owner Address: 0x1234...5678

🎉 Deployment completed!
```

### Deploy to Local Hardhat Network (for testing)

```bash
# Terminal 1 - Start local node
npx hardhat node

# Terminal 2 - Deploy to local network
npm run deploy:local
```

### Customize Deployment

To modify the initial supply or other parameters, edit `scripts/deploy.ts`:

```typescript
// Change initial supply (example: 5 million tokens)
const initialSupply = ethers.parseUnits("5000000", 18);
```

---

## Contract Verification

Contract verification is the process of publishing your smart contract's source code to a block explorer, allowing anyone to view and verify that the deployed bytecode matches the source code.

**📖 For a complete, detailed guide on contract verification, see [CONTRACT_VERIFICATION.md](CONTRACT_VERIFICATION.md)**

### Why Verify Contracts?

- **Transparency**: Users can see exactly what your contract does
- **Trust**: Proves the contract does what you claim it does
- **Interaction**: Block explorers provide UI for interacting with verified contracts
- **Security**: Community can audit the code for vulnerabilities
- **Best Practice**: Industry standard for professional projects

### Prerequisites for Verification

1. **Block Explorer**: Rayls block explorer supports contract verification
2. **Contract Address**: The deployed contract address
3. **Constructor Arguments**: The exact arguments used during deployment

### Method 1: Automatic Verification During Deployment

The easiest way is to verify immediately after deployment. Update your deployment script:

**`scripts/deploy-and-verify.ts`:**

```typescript
import { ethers, run } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the contract
  const initialSupply = ethers.parseUnits("1000000", 18);
  console.log("Initial supply:", ethers.formatUnits(initialSupply, 18), "tokens");

  console.log("\nDeploying RaylsToken contract...");
  const RaylsToken = await ethers.getContractFactory("RaylsToken");
  const token = await RaylsToken.deploy(initialSupply);

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  console.log("\n✅ RaylsToken deployed successfully!");
  console.log("Contract address:", tokenAddress);
  console.log("Transaction hash:", token.deploymentTransaction()?.hash);

  // Wait for a few block confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  await token.deploymentTransaction()?.wait(5);

  // Verify the contract
  console.log("\n🔍 Verifying contract on block explorer...");
  try {
    await run("verify:verify", {
      address: tokenAddress,
      constructorArguments: [initialSupply],
    });
    console.log("✅ Contract verified successfully!");
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("ℹ️ Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
    }
  }

  // Display contract details
  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.decimals();
  const totalSupply = await token.totalSupply();

  console.log("\n📋 Contract Details:");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Decimals:", decimals);
  console.log("Total Supply:", ethers.formatUnits(totalSupply, decimals));

  console.log("\n🎉 Deployment and verification completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Process failed:");
    console.error(error);
    process.exit(1);
  });
```

Run it:

```bash
npx hardhat run scripts/deploy-and-verify.ts --network rayls
```

### Method 2: Verify an Already Deployed Contract

If you've already deployed a contract and want to verify it later:

#### Using Hardhat Task

```bash
npx hardhat verify --network rayls <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

**Example:**

```bash
# For RaylsToken with 1,000,000 initial supply
npx hardhat verify --network rayls 0xYourContractAddress "1000000000000000000000000"
```

**Note:** Constructor arguments must be provided in their raw format (not using `parseUnits`).

#### Using a Verification Script

Create `scripts/verify.ts`:

```typescript
import { run } from "hardhat";
import { ethers } from "hardhat";

async function main() {
  // Replace with your deployed contract address
  const contractAddress = "0xYOUR_CONTRACT_ADDRESS";

  // Constructor arguments (must match exactly what was used during deployment)
  const initialSupply = ethers.parseUnits("1000000", 18);

  console.log("Verifying contract at:", contractAddress);
  console.log("Constructor arguments:", initialSupply.toString());

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [initialSupply],
    });
    console.log("✅ Contract verified successfully!");
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("ℹ️ Contract is already verified!");
    } else {
      console.error("❌ Verification failed:");
      console.error(error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Run it:

```bash
npx hardhat run scripts/verify.ts --network rayls
```

### Method 3: Manual Verification via Block Explorer

If Hardhat verification doesn't work, you can verify manually:

1. **Navigate to the block explorer** (e.g., `https://explorer.rayls.com`)

2. **Find your contract** by searching for the contract address

3. **Click "Verify & Publish"** or similar option

4. **Fill in the form:**
   - **Contract Address**: Your deployed contract address
   - **Compiler Type**: Solidity (Single file) or JSON (for complex projects)
   - **Compiler Version**: Must match exactly (check `hardhat.config.ts`)
   - **License**: MIT (or your chosen license)

5. **Optimization Settings:**
   - **Optimization Enabled**: Yes (if you enabled it in config)
   - **Runs**: 200 (or your configured value)

6. **Contract Code:**
   - **Flatten your contract** first (see below)
   - Paste the flattened source code

7. **Constructor Arguments** (ABI-encoded):
   - For RaylsToken with 1M supply: `0x00000000000000000000000000000000000000000000d3c21bcecceda1000000`

#### Flattening Your Contract

To get a single file with all imports:

```bash
npx hardhat flatten contracts/RaylsToken.sol > RaylsToken-flattened.sol
```

Then remove duplicate SPDX license identifiers (keep only the first one).

### Configuration for Verification

Update your `hardhat.config.ts` to include explorer API configuration:

```typescript
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
    rayls: {
      url: "https://devnet-rpc.rayls.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 123123,
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
```

**Note:** Rayls block explorer does not require an API key for contract verification.

### Verification Troubleshooting

#### "Already Verified" Error

**Solution:** The contract is already verified. Check the block explorer to confirm.

#### "Constructor Arguments Mismatch"

**Problem:** The provided constructor arguments don't match deployment

**Solution:**
- Ensure arguments are in the exact same format as deployment
- Use raw values, not helper functions
- For the RaylsToken example: `"1000000000000000000000000"` (1M with 18 decimals)

To encode constructor arguments properly:

```typescript
import { ethers } from "hardhat";

const initialSupply = ethers.parseUnits("1000000", 18);
console.log("Encoded value:", initialSupply.toString());
// Output: 1000000000000000000000000
```

#### "Compiler Version Mismatch"

**Problem:** The compiler version doesn't match

**Solution:**
- Check your `hardhat.config.ts` for the exact Solidity version
- Use the exact version including patch number (e.g., `0.8.20`, not `0.8.x`)

#### "Optimization Settings Mismatch"

**Problem:** Optimization settings don't match deployment

**Solution:**
- Verify your `hardhat.config.ts` settings
- Check if optimizer is enabled and the number of runs
- Default in this project: enabled with 200 runs

#### "Etherscan Plugin Doesn't Support This Network"

**Problem:** The network isn't recognized by the Hardhat Etherscan plugin

**Solution:**
- Use the `customChains` configuration shown above
- Ensure the `chainId` matches your network
- Update API and browser URLs with actual Rayls explorer endpoints

### Verifying Contract on Different Explorers

If Rayls has multiple block explorers or uses a standard explorer type:

**For BlockScout:**
```bash
npx hardhat verify --network rayls \
  --contract contracts/RaylsToken.sol:RaylsToken \
  0xYourContractAddress \
  "1000000000000000000000000"
```

**For Sourcify (decentralized verification):**
```bash
npx hardhat sourcify --network rayls
```

### Viewing Verified Contracts

Once verified, users can:

1. **View Source Code**: See the exact Solidity code
2. **Read Contract**: Call view functions directly from the explorer
3. **Write Contract**: Execute transactions using the explorer UI
4. **Verify Bytecode**: Confirm deployed bytecode matches source
5. **Check Dependencies**: See all imported contracts (OpenZeppelin, etc.)

### Best Practices

1. **Verify Immediately**: Verify right after deployment while you have all information fresh
2. **Document Arguments**: Keep a record of constructor arguments used
3. **Test First**: Deploy and verify on testnet before mainnet
4. **Use Scripts**: Automate verification with scripts for consistency
5. **Keep Config**: Don't modify `hardhat.config.ts` after deployment
6. **License Clarity**: Always specify the correct license in your contracts

---

## Interacting with Deployed Contracts

### Using Hardhat Console

Connect to Rayls network and interact with your deployed contract:

```bash
npx hardhat console --network rayls
```

Then in the console:

```javascript
// Get contract instance
const RaylsToken = await ethers.getContractFactory("RaylsToken");
const token = RaylsToken.attach("0xYOUR_CONTRACT_ADDRESS");

// Check balance
const balance = await token.balanceOf("0xYOUR_ADDRESS");
console.log("Balance:", ethers.formatUnits(balance, 18));

// Transfer tokens
await token.transfer("0xRECIPIENT_ADDRESS", ethers.parseUnits("100", 18));

// Mint new tokens (owner only)
await token.mint("0xRECIPIENT_ADDRESS", ethers.parseUnits("1000", 18));

// Check total supply
const supply = await token.totalSupply();
console.log("Total Supply:", ethers.formatUnits(supply, 18));
```

### Creating an Interaction Script

Create a new file `scripts/interact.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0xYOUR_CONTRACT_ADDRESS";
  const RaylsToken = await ethers.getContractFactory("RaylsToken");
  const token = RaylsToken.attach(contractAddress);

  // Get token info
  const name = await token.name();
  const symbol = await token.symbol();
  const totalSupply = await token.totalSupply();

  console.log(`Token: ${name} (${symbol})`);
  console.log(`Total Supply: ${ethers.formatUnits(totalSupply, 18)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Run it:

```bash
npx hardhat run scripts/interact.ts --network rayls
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot find module" errors

**Solution:**
```bash
npm install
npx hardhat clean
npm run compile
```

#### 2. "Invalid private key" error

**Problem:** Private key format is incorrect

**Solution:**
- Ensure private key starts with `0x`
- Private key should be 66 characters (0x + 64 hex characters)
- Check for extra spaces or quotes in `.env` file

#### 3. "Insufficient funds" error

**Problem:** Account doesn't have enough tokens for gas

**Solution:**
- Request tokens from Rayls faucet
- Verify balance: `npx hardhat run scripts/check-balance.ts --network rayls`

#### 4. "Network error" or "Connection timeout"

**Problem:** Cannot connect to Rayls RPC

**Solution:**
- Verify RPC URL is correct: `https://devnet-rpc.rayls.com`
- Check your internet connection
- Try increasing timeout in `hardhat.config.ts`:
  ```typescript
  rayls: {
    url: "https://devnet-rpc.rayls.com",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 743111,
    timeout: 60000, // Add this line
  }
  ```

#### 5. "Chain ID mismatch" error

**Problem:** Configured chain ID doesn't match the network

**Solution:**
- Query the actual chain ID from the network
- Update `chainId` in `hardhat.config.ts`

To get the chain ID:
```javascript
// In Hardhat console
const chainId = await ethers.provider.getNetwork().then(n => n.chainId);
console.log("Chain ID:", chainId);
```

#### 6. Tests failing

**Solution:**
```bash
npx hardhat clean
npm run compile
npm test
```

#### 7. TypeScript errors

**Solution:**
```bash
npm install --save-dev @types/node
npx hardhat compile
```

---

## Additional Resources

### Hardhat Documentation
- [Hardhat Official Docs](https://hardhat.org/docs)
- [Hardhat Network](https://hardhat.org/hardhat-network/docs)
- [Testing with Hardhat](https://hardhat.org/tutorial/testing-contracts)

### Ethereum & Solidity
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [ERC20 Token Standard](https://eips.ethereum.org/EIPS/eip-20)

### Ethers.js
- [Ethers.js v6 Documentation](https://docs.ethers.org/v6/)
- [Contract Interaction Guide](https://docs.ethers.org/v6/api/contract/)

### Rayls Blockchain
- Check Rayls official documentation for:
  - Network specifications
  - Faucet information
  - Block explorer
  - RPC endpoints
  - Chain ID

### Development Tools
- [Visual Studio Code](https://code.visualstudio.com/)
- [Solidity Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)
- [MetaMask Wallet](https://metamask.io/)

---

## Security Best Practices

When developing and deploying smart contracts:

1. **Never expose private keys**: Always use `.env` files and never commit them
2. **Audit contracts**: Have your contracts audited before mainnet deployment
3. **Test thoroughly**: Write comprehensive tests and achieve high coverage
4. **Use latest versions**: Keep dependencies updated for security patches
5. **Start with testnet**: Always deploy to testnet before mainnet
6. **Verify contracts**: Verify your contract source code on block explorers
7. **Implement access control**: Use modifiers like `onlyOwner` for sensitive functions
8. **Check for reentrancy**: Be aware of reentrancy attacks in your contract logic

---

## License

This project is licensed under the MIT License.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Hardhat documentation
3. Check Rayls blockchain documentation
4. Open an issue in the project repository

---

**Happy coding on Rayls! 🚀**
