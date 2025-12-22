import { ethers } from "hardhat";

async function main() {
  console.log("Deploying NameRegistry...");

  const NameRegistry = await ethers.getContractFactory("NameRegistry");
  const registry = await NameRegistry.deploy();

  // Wait for the deployment to be confirmed on the blockchain
  await registry.waitForDeployment();
  console.log("SUCCESS! Contract Address:", await registry.getAddress());

  const address = await registry.getAddress();
  console.log(`✅ NameRegistry deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});










// import { DeployFunction } from "hardhat-deploy/types";
// import { HardhatRuntimeEnvironment } from "hardhat/types";

// const DAY_IN_SECONDS = 60 * 60 * 24;
// const NOW_IN_SECONDS = Math.round(Date.now() / 1000);
// const UNLOCK_IN_X_DAYS = NOW_IN_SECONDS + DAY_IN_SECONDS * 1; // 1 DAY

// const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   const { deployer } = await hre.getNamedAccounts();
//   const { deploy } = hre.deployments;
//   const lockedAmount = hre.ethers.parseEther("0.01").toString();

//   const lock = await deploy("Lock", {
//     from: deployer,
//     args: [UNLOCK_IN_X_DAYS],
//     log: true,
//     value: lockedAmount,
//   });

//   console.log(`Lock contract: `, lock.address);
// };
// export default func;
// func.id = "deploy_lock"; // id required to prevent reexecution
// func.tags = ["Lock"];
