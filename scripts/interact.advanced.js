const hre = require("hardhat");
const path = require("path");
const fs = require("fs");
const { ethers } = hre;


// 🔎 Función para encontrar un tokenId válido que pertenezca al owner
async function getValidTokenId(contract, owner) {
    const balance = await contract.balanceOf(owner);
    if (balance == 0) throw new Error(`El dueño ${owner.address} no tiene NFTs.`);

    for (let tokenId = 0; tokenId < 1000; tokenId++) {
        try {
            const tokenOwner = await contract.ownerOf(tokenId);
            if (tokenOwner.toLowerCase() === owner.address.toLowerCase()) {
                return tokenId;
            }
        } catch (error) {
            // TokenId no existente
        }
    }

    throw new Error(`No se encontró un NFT válido para ${owner.address}`);
}

// 🔁 Mint con pago usando la función mintWithPayment del contrato
async function paymentMint(myNFT) {
    const buyer = (await hre.ethers.getSigners())[2]; // Cuenta 2 como comprador
    const nftPrice = ethers.parseEther("0.01");

    console.log("💸 Realizando mint con pago desde:", buyer.address);

    const mintTx = await myNFT.connect(buyer).mintWithPayment({ value: nftPrice });
    await mintTx.wait();

    const balance = await myNFT.balanceOf(buyer.address);
    console.log(`✅ NFT comprado y minteado por ${buyer.address}. Ahora tiene ${balance.toString()} token(s).`);
}

async function main() {
    const [owner, recipient] = await hre.ethers.getSigners();
    console.log("✅ Address owner:", owner.address);
    console.log("✅ Address recipient:", recipient.address);

    const deploymentsDir = path.join(__dirname, "../frontend");
    const contractJson = fs.readFileSync(path.join("MyDeploy.json"), "utf-8");
    const contractAddress = JSON.parse(contractJson).address;

    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.attach(contractAddress);

    // ✨ Mint clásico (gratis) por el owner
    const mintTx = await myNFT.mint();
    await mintTx.wait();
    console.log("✅ NFT minteado correctamente.");
    console.log(`📌 Dirección del contrato MyNFT: ${myNFT.target}`);

    // 🛒 Mint con pago por un tercero
    await paymentMint(myNFT);

    // 📦 Balance del owner
    const balance = await myNFT.balanceOf(owner.address);
    console.log(`📊 Balance del owner después del mint: ${balance.toString()}`);

    // 🎯 Transferencia del NFT minteado por el owner
    const tokenId = await getValidTokenId(myNFT, owner);
    console.log(`🆔 Usando el NFT con ID: ${tokenId}`);

    const currentOwner = await myNFT.ownerOf(tokenId);
    console.log(`👤 El dueño actual del token ID ${tokenId} es: ${currentOwner}`);

    if (currentOwner.toLowerCase() !== owner.address.toLowerCase()) {
        throw new Error(`❌ El owner actual (${currentOwner}) no es el dueño del NFT ${tokenId}`);
    }

    await myNFT.approve(recipient.address, tokenId);
    console.log(`🔑 NFT con ID ${tokenId} aprobado para: ${recipient.address}`);

    const transferTx = await myNFT.transferFrom(owner.address, recipient.address, tokenId);
    await transferTx.wait();
    console.log(`📤 NFT con ID ${tokenId} transferido a: ${recipient.address}`);

    const newOwner = await myNFT.ownerOf(tokenId);
    console.log(`✅ El nuevo dueño del NFT con ID ${tokenId} es: ${newOwner}`);
}

// 🚀 Ejecutar el script
main().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
});
