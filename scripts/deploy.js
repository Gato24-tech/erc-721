const { ethers } = require("hardhat"); // ✅ Importa ethers correctamente

async function main() {
    const [owner] = await ethers.getSigners(); // ✅ Obtiene el deployer

    console.log("Deploying contract with account:", owner.address);

    const NFT = await ethers.getContractFactory("MyNFT");
    const nft = await NFT.deploy(); // ✅ Desplega el contrato

    await nft.waitForDeployment();
    console.log("NFT contract deployed at:", await nft.getAddress());

    // ✅ Minta un NFT correctamente
    const mintTx = await nft.mint(owner.address);
    await mintTx.wait();

    console.log("Minted NFT to:", owner.address);
}

// ✅ Llama a main() correctamente dentro de un bloque try-catch
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
