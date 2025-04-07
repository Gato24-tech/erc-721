const hre = require("hardhat");
const Path = require("path");
const fs = require("fs");
const path = require("path");


async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contract with address:", deployer.address);

    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy(10); // Por ejemplo, máximo de 10 NFTs
    await myNFT.waitForDeployment();

    const contractAddress = await myNFT.getAddress();

    console.log("MyNFT deployed to:", contractAddress);
    const deploymentsDir = Path.join(__dirname,"../deploments"); 

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
        path.join(deploymentsDir,"MyDeploy.js"),
        JSON.stringify({address: contractAddress}, null, 2)
        
    );

    console.log("Dirección guardada en deployments/MyDeploy.json");

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
