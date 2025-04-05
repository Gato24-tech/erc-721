const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contract with address:", deployer.address);

    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy(10); // Por ejemplo, máximo de 10 NFTs
    await myNFT.waitForDeployment();

    console.log("MyNFT deployed to:", myNFT.target);
    const deploymentsDir = Path.join(__dirname,"../deploments");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
