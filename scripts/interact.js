const hre = require("hardhat");

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
            // Ignorar errores
        }
    }

    throw new Error(`No se encontró un NFT válido para ${owner.address}`);
}

// 🔹 La función getValidTokenId() ya está cerrada correctamente y no interfiere con main()

async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const myNFT = MyNFT.attach(contractAddress);
    console.log("Contrato NFT adjuntado en:", myNFT.target);

    const [owner, recipient] = await hre.ethers.getSigners();
    console.log("Address owner:", owner.address);
    console.log("Address Recipient:", recipient.address);

    // Mint NFT a owner
    const mintTx = await myNFT.mint(owner.address);
    await mintTx.wait();
    console.log("NFT minteado para:", owner.address);

    // Ver el balance del dueño
    const balance = await myNFT.balanceOf(owner.address);
    console.log("Balance de NFTs del dueño:", balance.toString());

    // Obtener un NFT que realmente le pertenezca al owner
    const tokenId = await getValidTokenId(myNFT, owner);
    console.log(`Usando el NFT con ID ${tokenId}`);

    // Verificar el dueño real del NFT
    const currentOwner = await myNFT.ownerOf(tokenId);
    console.log(`El dueño del NFT con ID ${tokenId} es:`, currentOwner);

    // Solo aprobar si el owner realmente tiene el NFT
    if (currentOwner.toLowerCase() !== owner.address.toLowerCase()) {
        throw new Error(`El owner actual (${currentOwner}) no es el dueño del NFT ${tokenId}`);
    }

    await myNFT.approve(recipient.address, tokenId);
    console.log(`Aprobado el NFT con ID ${tokenId} para:`, recipient.address);

    // Transferir después de aprobar
    const transferTx = await myNFT.transferFrom(owner.address, recipient.address, tokenId);
    await transferTx.wait();
    console.log(`Transferido el NFT con ID ${tokenId} a:`, recipient.address);

    const newOwner = await myNFT.ownerOf(tokenId);
    console.log(`El nuevo dueño del NFT con ID ${tokenId} es:`, newOwner);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
