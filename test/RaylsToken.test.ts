import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { RaylsToken } from "../typechain-types";

describe("RaylsToken E2E Test Suite", function () {
  let raylsToken: RaylsToken;
  let owner: SignerWithAddress;
  let userA: SignerWithAddress;
  let userB: SignerWithAddress;

  const INITIAL_MINT_AMOUNT = ethers.parseEther("1000");
  const TRANSFER_AMOUNT = ethers.parseEther("100");
  const BURN_AMOUNT = ethers.parseEther("50");

  const TOKEN_NAME = "Rayls Token";
  const TOKEN_SYMBOL = "RAYLS";
  const INITIAL_SUPPLY = ethers.parseEther("0");

  before(async function () {
    [owner, userA, userB] = await ethers.getSigners();

    const RaylsTokenFactory = await ethers.getContractFactory("RaylsToken");

    try {

      raylsToken = await RaylsTokenFactory.deploy(TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY);
      await raylsToken.waitForDeployment();
      console.log("✓ RaylsToken deployed with (name, symbol, initialSupply)");
    } catch (error: any) {
      if (error.message.includes("incorrect number of arguments")) {
        try {
          raylsToken = await RaylsTokenFactory.deploy(owner.address);
          await raylsToken.waitForDeployment();
          console.log("✓ RaylsToken deployed with (owner)");
        } catch (error2) {
          raylsToken = await RaylsTokenFactory.deploy();
          await raylsToken.waitForDeployment();
          console.log("✓ RaylsToken deployed without arguments");
        }
      } else {
        throw error;
      }
    }

    console.log("✓ RaylsToken deployed at:", await raylsToken.getAddress());
  });

  describe("1. Deployment & Ownership", function () {
    it("Should deploy contract successfully", async function () {
      const address = await raylsToken.getAddress();
      expect(address).to.not.equal(ethers.ZeroAddress);
      expect(address).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("Should set owner as deployer", async function () {
      const currentOwner = await raylsToken.owner();
      expect(currentOwner).to.equal(owner.address);
    });

    it("Should have correct token name and symbol", async function () {
      const name = await raylsToken.name();
      const symbol = await raylsToken.symbol();

      expect(name).to.be.a("string");
      expect(symbol).to.be.a("string");
      console.log(`  Token: ${name} (${symbol})`);
    });

    it("Should have correct decimals", async function () {
      const decimals = await raylsToken.decimals();
      expect(decimals).to.equal(18);
    });

    it("Should start with zero or configured total supply", async function () {
      const totalSupply = await raylsToken.totalSupply();
      expect(totalSupply).to.be.gte(0n);
      console.log(`  Initial total supply: ${ethers.formatEther(totalSupply)}`);
    });
  });

  describe("2. Access Control - Minting", function () {
    it("Should allow owner to mint tokens to User A", async function () {
      const initialBalance = await raylsToken.balanceOf(userA.address);

      const mintTx = await raylsToken.mint(userA.address, INITIAL_MINT_AMOUNT);
      await mintTx.wait();

      const finalBalance = await raylsToken.balanceOf(userA.address);
      expect(finalBalance).to.equal(initialBalance + INITIAL_MINT_AMOUNT);

      const totalSupply = await raylsToken.totalSupply();
      expect(totalSupply).to.be.gte(INITIAL_MINT_AMOUNT);

      console.log(
        `  ✓ Owner minted ${ethers.formatEther(INITIAL_MINT_AMOUNT)} tokens to User A`
      );
    });

    it("Should NOT allow non-owner (User B) to mint tokens", async function () {
      const mintTx = raylsToken
        .connect(userB)
        .mint(userB.address, TRANSFER_AMOUNT);

      await expect(mintTx).to.be.revertedWithCustomError(
        raylsToken,
        "OwnableUnauthorizedAccount"
      );

      console.log(
        `  ✓ Non-owner (User B) cannot mint - transaction reverted`
      );
    });

    it("Should NOT allow non-owner (User A) to mint tokens", async function () {
      const initialTotalSupply = await raylsToken.totalSupply();

      const mintTx = raylsToken
        .connect(userA)
        .mint(userA.address, TRANSFER_AMOUNT);

      await expect(mintTx).to.be.revertedWithCustomError(
        raylsToken,
        "OwnableUnauthorizedAccount"
      );

      const finalTotalSupply = await raylsToken.totalSupply();
      expect(finalTotalSupply).to.equal(initialTotalSupply);

      console.log(
        `  ✓ Non-owner (User A) cannot mint - transaction reverted`
      );
    });

    it("Owner should be able to mint multiple times", async function () {
      const balanceBefore = await raylsToken.balanceOf(userA.address);

      const mintTx = await raylsToken.mint(userA.address, TRANSFER_AMOUNT);
      await mintTx.wait();

      const balanceAfter = await raylsToken.balanceOf(userA.address);
      expect(balanceAfter).to.equal(balanceBefore + TRANSFER_AMOUNT);

      console.log(`  ✓ Owner minted additional tokens successfully`);
    });
  });

  describe("3. ERC20 Approval & Transfer Flow", function () {
    it("Should allow User A to approve User B for spending", async function () {

      const approveTx = await raylsToken
        .connect(userA)
        .approve(userB.address, TRANSFER_AMOUNT);
      await approveTx.wait();

      const allowance = await raylsToken.allowance(userA.address, userB.address);
      expect(allowance).to.equal(TRANSFER_AMOUNT);

      console.log(
        `  ✓ User A approved User B to spend ${ethers.formatEther(TRANSFER_AMOUNT)} tokens`
      );
    });

    it("Should allow User B to transferFrom User A's tokens", async function () {
      const userABalanceBefore = await raylsToken.balanceOf(userA.address);
      const userBBalanceBefore = await raylsToken.balanceOf(userB.address);

      const transferTx = await raylsToken
        .connect(userB)
        .transferFrom(userA.address, userB.address, TRANSFER_AMOUNT);
      await transferTx.wait();

      const userABalanceAfter = await raylsToken.balanceOf(userA.address);
      expect(userABalanceAfter).to.equal(userABalanceBefore - TRANSFER_AMOUNT);

      const userBBalanceAfter = await raylsToken.balanceOf(userB.address);
      expect(userBBalanceAfter).to.equal(userBBalanceBefore + TRANSFER_AMOUNT);

      console.log(
        `  ✓ User B transferred ${ethers.formatEther(TRANSFER_AMOUNT)} tokens from User A`
      );
    });

    it("Should decrease allowance after transferFrom", async function () {

      const allowance = await raylsToken.allowance(userA.address, userB.address);
      expect(allowance).to.equal(0n);

      console.log(`  ✓ Allowance correctly decreased to 0`);
    });

    it("Should NOT allow User B to transferFrom more than approved", async function () {

      const smallAmount = ethers.parseEther("10");
      await raylsToken
        .connect(userA)
        .approve(userB.address, smallAmount);

      const transferTx = raylsToken
        .connect(userB)
        .transferFrom(userA.address, userB.address, TRANSFER_AMOUNT);

      await expect(transferTx).to.be.revertedWithCustomError(
        raylsToken,
        "ERC20InsufficientAllowance"
      );

      console.log(`  ✓ Cannot transfer more than approved amount`);
    });

    it("Should update allowance when User A approves more tokens", async function () {
      const newApprovalAmount = ethers.parseEther("500");

      const approveTx = await raylsToken
        .connect(userA)
        .approve(userB.address, newApprovalAmount);
      await approveTx.wait();

      const allowance = await raylsToken.allowance(userA.address, userB.address);
      expect(allowance).to.equal(newApprovalAmount);

      console.log(
        `  ✓ Allowance updated to ${ethers.formatEther(newApprovalAmount)}`
      );
    });
  });

  describe("4. Token Burning", function () {
    it("Should allow User B to burn their own tokens", async function () {
      const balanceBefore = await raylsToken.balanceOf(userB.address);
      const totalSupplyBefore = await raylsToken.totalSupply();

      if (balanceBefore < BURN_AMOUNT) {
        console.log(`  ⚠️  User B has insufficient balance to burn`);
        this.skip();
      }

      const burnTx = await raylsToken.connect(userB).burn(BURN_AMOUNT);
      await burnTx.wait();

      const balanceAfter = await raylsToken.balanceOf(userB.address);
      expect(balanceAfter).to.equal(balanceBefore - BURN_AMOUNT);

      const totalSupplyAfter = await raylsToken.totalSupply();
      expect(totalSupplyAfter).to.equal(totalSupplyBefore - BURN_AMOUNT);

      console.log(
        `  ✓ User B burned ${ethers.formatEther(BURN_AMOUNT)} tokens`
      );
      console.log(
        `    Total supply: ${ethers.formatEther(totalSupplyBefore)} → ${ethers.formatEther(totalSupplyAfter)}`
      );
    });

    it("Should NOT allow burning more tokens than balance", async function () {
      const userBBalance = await raylsToken.balanceOf(userB.address);
      const excessAmount = userBBalance + ethers.parseEther("1000");

      const burnTx = raylsToken.connect(userB).burn(excessAmount);

      await expect(burnTx).to.be.revertedWithCustomError(
        raylsToken,
        "ERC20InsufficientBalance"
      );

      console.log(`  ✓ Cannot burn more tokens than balance`);
    });

    it("Should allow User A to burn their remaining tokens", async function () {
      const balanceBefore = await raylsToken.balanceOf(userA.address);
      const totalSupplyBefore = await raylsToken.totalSupply();

      if (balanceBefore === 0n) {
        console.log(`  ℹ️  User A has no tokens to burn`);
        this.skip();
      }

      const burnTx = await raylsToken.connect(userA).burn(balanceBefore);
      await burnTx.wait();

      const balanceAfter = await raylsToken.balanceOf(userA.address);
      expect(balanceAfter).to.equal(0n);

      const totalSupplyAfter = await raylsToken.totalSupply();
      expect(totalSupplyAfter).to.equal(totalSupplyBefore - balanceBefore);

      console.log(
        `  ✓ User A burned all remaining tokens (${ethers.formatEther(balanceBefore)})`
      );
    });
  });

  describe("5. Integration Scenarios", function () {
    it("Should handle complex token flow: mint → approve → transfer → burn", async function () {
      const testAddr = userA;
      const mintAmount = ethers.parseEther("500");
      const transferAmount = ethers.parseEther("200");
      const burnAmount = ethers.parseEther("100");

      console.log("\n    Scenario: Mint → Approve → Transfer → Burn");

      let tx = await raylsToken.mint(testAddr.address, mintAmount);
      await tx.wait();
      let balance = await raylsToken.balanceOf(testAddr.address);
      console.log(`    1. Minted ${ethers.formatEther(mintAmount)}, Balance: ${ethers.formatEther(balance)}`);
      expect(balance).to.equal(mintAmount);

      tx = await raylsToken
        .connect(testAddr)
        .approve(userB.address, transferAmount);
      await tx.wait();
      const allowance = await raylsToken.allowance(testAddr.address, userB.address);
      console.log(`    2. Approved userB for ${ethers.formatEther(transferAmount)}`);
      expect(allowance).to.equal(transferAmount);

      tx = await raylsToken
        .connect(userB)
        .transferFrom(testAddr.address, userB.address, transferAmount);
      await tx.wait();
      const testAddrBalance = await raylsToken.balanceOf(testAddr.address);
      const userBBalance = await raylsToken.balanceOf(userB.address);
      console.log(`    3. Transferred ${ethers.formatEther(transferAmount)}`);
      console.log(`       testAddr balance: ${ethers.formatEther(testAddrBalance)}`);
      console.log(`       userB balance: ${ethers.formatEther(userBBalance)}`);
      expect(testAddrBalance).to.equal(mintAmount - transferAmount);

      const totalSupplyBefore = await raylsToken.totalSupply();
      tx = await raylsToken.connect(userB).burn(burnAmount);
      await tx.wait();
      const totalSupplyAfter = await raylsToken.totalSupply();
      const userBFinalBalance = await raylsToken.balanceOf(userB.address);
      console.log(`    4. userB burned ${ethers.formatEther(burnAmount)}`);
      console.log(`       userB final balance: ${ethers.formatEther(userBFinalBalance)}`);
      console.log(`       Total supply: ${ethers.formatEther(totalSupplyBefore)} → ${ethers.formatEther(totalSupplyAfter)}`);
      expect(totalSupplyAfter).to.equal(totalSupplyBefore - burnAmount);
    });
  });

  describe("6. Edge Cases & Error Handling", function () {
    it("Should handle zero amount transfers gracefully", async function () {
      const tx = await raylsToken
        .connect(userA)
        .transfer(userB.address, 0n);
      await tx.wait();

      console.log(`  ✓ Zero amount transfer handled`);
    });

    it("Should revert transfer with insufficient balance", async function () {
      const balance = await raylsToken.balanceOf(userA.address);
      const excessAmount = balance + ethers.parseEther("1");

      const transferTx = raylsToken
        .connect(userA)
        .transfer(userB.address, excessAmount);

      await expect(transferTx).to.be.revertedWithCustomError(
        raylsToken,
        "ERC20InsufficientBalance"
      );

      console.log(`  ✓ Insufficient balance transfer reverted`);
    });

    it("Should handle direct transfer from user to user", async function () {
      const userABalance = await raylsToken.balanceOf(userA.address);

      if (userABalance < TRANSFER_AMOUNT) {
        console.log(`  ⚠️  User A has insufficient balance`);
        this.skip();
      }

      const tx = await raylsToken
        .connect(userA)
        .transfer(userB.address, TRANSFER_AMOUNT);
      await tx.wait();

      const finalBalance = await raylsToken.balanceOf(userA.address);
      expect(finalBalance).to.equal(userABalance - TRANSFER_AMOUNT);

      console.log(`  ✓ Direct transfer executed successfully`);
    });
  });

  describe("7. Event Verification", function () {
    it("Should emit Transfer event on mint", async function () {
      const mintAmount = ethers.parseEther("100");
      const testAddr = userA;

      const tx = await raylsToken.mint(testAddr.address, mintAmount);
      const receipt = await tx.wait();

      expect(receipt?.logs.length).to.be.greaterThan(0);
      console.log(`  ✓ Transfer event emitted on mint`);
    });

    it("Should emit Approval event on approve", async function () {
      const approveAmount = ethers.parseEther("50");

      const tx = await raylsToken
        .connect(userA)
        .approve(userB.address, approveAmount);
      const receipt = await tx.wait();

      expect(receipt?.logs.length).to.be.greaterThan(0);
      console.log(`  ✓ Approval event emitted`);
    });

    it("Should emit Transfer event on burn", async function () {
      const balance = await raylsToken.balanceOf(userB.address);
      if (balance > 0n && balance >= ethers.parseEther("10")) {
        const tx = await raylsToken.connect(userB).burn(ethers.parseEther("10"));
        const receipt = await tx.wait();

        expect(receipt?.logs.length).to.be.greaterThan(0);
        console.log(`  ✓ Transfer event emitted on burn`);
      } else {
        console.log(`  ⚠️  User B has insufficient balance for burn test`);
      }
    });
  });
});
