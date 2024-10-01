import { ethers } from "hardhat";

async function main() {
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Display the account balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);

  // Compile and deploy your contract
  const ContractFactory = await ethers.getContractFactory("EncryptedProfileStorage");
  const contract = await ContractFactory.deploy();

  // Wait for the deployment to finish
    await contract.deploymentTransaction()?.wait();
    console.log(`Contract deployed at: ${contract.target}`);
  
}

main().catch((error) => {
  console.error("Error deploying the contract:", error);
  process.exitCode = 1;
});
