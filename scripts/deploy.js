const hre = require("hardhat");

async function main() {
    // Obtener la fábrica del contrato
    const MyNFT = await hre.ethers.getContractFactory("MyNFT"); 
    
    // Desplegar el contrato
    const myNFT = await MyNFT.deploy();
    await myNFT.waitForDeployment(); 

    // Obtener la dirección del contrato desplegado
    const contractAddress = await myNFT.getAddress();
    console.log("Contrato NFT desplegado en:", contractAddress);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
