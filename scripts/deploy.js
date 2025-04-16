const hre = require("hardhat");
const Path = require("path");
const fs = require("fs");


async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contract with address:", deployer.address);

    const baseUri = "https://my-nft-base-uri.com/metadata/";
    const maxSupply = 100; // Esta cantidad la podemos cambiar.

    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy(baseUri, maxSupply); 
    await myNFT.waitForDeployment();

    const contractAddress = await myNFT.getAddress();
    console.log("contract deployed to:", contractAddress);
    
    // Defino la ruta para guardar el archivo JSON
    const frontendPath = path.join(__dirname,"..", "forntend", "MyDeploy.json");

    // Creo los datos a guardar
    const data = {
        address: contractAddress,
        network: hre.network.name,
        timestamp: new Date().toISOString()
    };
    
    // Escribo el archivo
    fs.writeFileSync(frontendPath, JSON.stringify(data, null,2));
    console.log("Dirección guardada en frontend/MyDeploy.json");
}     
    
main().catch((error) => {
    console.error("Error al desplegar:", error);
    process.exitCode = 1;
});
