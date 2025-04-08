const hre = require("hardhat");
const path = require("path");
const fs = require("fs");

// 🔎 Función para encontrar un tokenId válido que pertenezca al owner
async function getValidTokenId(contract, owner) {
    const balance = await contract.balanceOf(owner);
    if (balance == 0) {
        throw new Error(`El dueño ${owner.address} no tiene NFTs.`);
    }

    for (let tokenId = 0; tokenId < 1000; tokenId++) {
        try {
            const tokenOwner = await contract.ownerOf(tokenId);
            if (tokenOwner.toLowerCase() === owner.address.toLowerCase()) {
                return tokenId;
            }
        } catch (error) {
            // Ignorar errores por tokenId inexistentes
        }
    }

    throw new Error(`No se encontró un NFT válido para ${owner.address}`);
}

async function main() {
    // 🧾 Obtener cuentas del entorno local (Hardhat)
    const [owner, recipient] = await hre.ethers.getSigners();
    console.log("✅ Address owner:", owner.address);
    console.log("✅ Address recipient:", recipient.address);

    // 📁 Leer dirección del contrato desde el JSON generado al hacer deploy
    const deploymentsDir = path.join(__dirname, "../deployments");
    const contractJson = fs.readFileSync(path.join(deploymentsDir, "MyDeploy.json"), "utf-8");
    const contractAddress = JSON.parse(contractJson).address;

    // 🔗 Obtener y conectar el contrato desplegado
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.attach(contractAddress);

    // 🪄 Mint de NFT sin parámetros (URI dinámica dentro del contrato)
    const mintTx = await myNFT.mint();
    await mintTx.wait();
    console.log("✅ NFT minteado correctamente.");
    console.log(`📌 Dirección del contrato MyNFT: ${myNFT.target}`);

    // 📦 Ver balance del owner
    const balance = await myNFT.balanceOf(owner.address);
    console.log(`📊 Balance del owner después del mint: ${balance.toString()}`);

    // 🔍 Obtener un tokenId válido del owner
    const tokenId = await getValidTokenId(myNFT, owner);
    console.log(`🆔 Usando el NFT con ID: ${tokenId}`);

    // 👁️ Verificar el dueño actual del tokenId
    const currentOwner = await myNFT.ownerOf(tokenId);
    console.log(`👤 El dueño actual del token ID ${tokenId} es: ${currentOwner}`);

    // 🔐 Confirmar que el dueño actual es el owner antes de aprobar
    if (currentOwner.toLowerCase() !== owner.address.toLowerCase()) {
        throw new Error(`❌ El owner actual (${currentOwner}) no es el dueño del NFT ${tokenId}`);
    }

    // ✅ Aprobar la transferencia del tokenId al recipient
    await myNFT.approve(recipient.address, tokenId);
    console.log(`🔑 NFT con ID ${tokenId} aprobado para: ${recipient.address}`);

    // 🚚 Transferir NFT desde owner hacia recipient
    const transferTx = await myNFT.transferFrom(owner.address, recipient.address, tokenId);
    await transferTx.wait();
    console.log(`📤 NFT con ID ${tokenId} transferido a: ${recipient.address}`);

    // 👥 Verificar nuevo dueño del token
    const newOwner = await myNFT.ownerOf(tokenId);
    console.log(`✅ El nuevo dueño del NFT con ID ${tokenId} es: ${newOwner}`);
}

// 🛠️ Ejecutar main y capturar errores
main().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
});
