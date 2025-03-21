const hre = require("hardhat");

async function main() {

const MyNFT = await hre.ethers.getContractAt("MyNFT");
const myNFT = await MyNFT.deploy();
await myNFT.wairForDeployment();

const contractAddress = await myNFT.getAddress();
console.log("contrato NFT desplegado en:", contractAddress);
}

main().catch((error) => {
    console.error(error);
    process.exit.code = 1;

});