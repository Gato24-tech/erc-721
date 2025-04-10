const hre = require("hardhat");
const Path = require("path");
const fs = require("fs");
const path = require("path");


async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contract with address:", deployer.address);

    const baseUri = "https://my-nft-base-uri.com/metadata/";
    const maxSupply = 100; // Esta cantidad la podemos cambiar.

    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy(baseUri, maxSupply); 
    await myNFT.waitForDeployment();

    console.log("contract deployed to:", myNFT.getAddress);

    const contractAddress = await myNFT.getAddress();

    console.log("MyNFT deployed to:", contractAddress);
    const deploymentsDir = path.join(__dirname,"../deployments"); 

    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir); 
    }

        // Guardar la dirección en formato JSON
        const data = {
            address: contractAddress,
            network: hre.network.name,
            timestamp: new Date().toISOString()
        };

    fs.writeFileSync(
        path.join(deploymentsDir,"MyDeploy.json"),
        JSON.stringify({address: await myNFT.getAddress()}, null, 2)
        
    );

    console.log("Dirección guardada en deployments/MyDeploy.json");

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
