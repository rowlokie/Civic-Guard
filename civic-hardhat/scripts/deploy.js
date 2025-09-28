const { ethers } = require("hardhat");

async function main() {
  const UrbanCoin = await ethers.getContractFactory("UrbanCoin");
  const urbanCoin = await UrbanCoin.deploy();

  await urbanCoin.waitForDeployment();
  const address = await urbanCoin.getAddress();

  console.log(`✅ UrbanCoin deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
