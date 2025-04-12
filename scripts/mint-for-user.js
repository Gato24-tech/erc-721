const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = hre;

async function main() {
    const [deployer, buyer] = await hre.ethers.getSigners();

    // Leer la dirección del contrato
    const contractJson = fs.readFileSync(path.join(__dirname, "../deployments/MyDeploy.json"), "utf8");
    const contractAddress = JSON.parse(contractJson).address;

    // Conectar al contrato
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const nft = MyNFT.attach(contractAddress);

    // Llamar al mint con pago, pasando el contrato y el buyer
    await paymentMint(nft, buyer);
}

async function paymentMint(nft, buyer) {
    // Puedes obtenerlo desde el contrato
    const price = await nft.nftPrice(); //Devuelve un BigInt ya
    console.log("💰 Precio del NFT:", ethers.formatEther(price), "ETH");

    // Mint con el precio obtenido
    const tx = await nft.connect(buyer).mintWithPayment({ value:price });
    await tx.wait();

    const balance = await nft.balanceOf(buyer.address);
    console.log(`✅ NFT minteado por ${buyer.address}. Ahora tiene ${balance.toString()} NFT(s).`);
    console.log("🚀 Iniciando script mint-for-user.js...");

}

// Ejecución
main().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
});
