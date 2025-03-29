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
            // Ignorar errores (posibles tokenId inexistentes)
        }
    }

    throw new Error(`No se encontró un NFT válido para ${owner.address}`);
}

async function main() { 
    const [owner, recipient] = await hre.ethers.getSigners();
    console.log("Address owner:", owner.address);
    console.log("Address recipient:", recipient.address);

    // Adjuntar contrato desplegado
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    const myNFT = await hre.ethers.getContractAt("MyNFT", contractAddress);
    console.log("Contrato NFT adjuntado en:", contractAddress);
    console.log(myNFT.interface.fragments);

    // Mint NFT a owner
    const tokenURI = "https://my-json-server.typicode.com/example/metadata/1";
    const mintTx = await myNFT.mintNFT(owner.address, "ipfs://token-uri");
    await mintTx.wait();
    console.log("NFT minteado para:");

    // Ver balance del dueño
    const balance = await myNFT.balanceOf(owner.address);
    console.log("Balance de NFTs del dueño:", balance.toString());

    // Obtener un NFT válido del owner
    const tokenId = await getValidTokenId(myNFT, owner);
    console.log(`Usando el NFT con ID ${tokenId}`);

    // Verificar el dueño real del NFT
    const currentOwner = await myNFT.ownerOf(tokenId);
    console.log(`El dueño del NFT con ID ${tokenId} es:`, currentOwner);

    // Asegurar que el owner realmente tiene el NFT antes de aprobar
    if (currentOwner.toLowerCase() !== owner.address.toLowerCase()) {
        throw new Error(`El owner actual (${currentOwner}) no es el dueño del NFT ${tokenId}`);
    }

    // Aprobar transferencia
    await myNFT.approve(recipient.address, tokenId);
    console.log(`Aprobado el NFT con ID ${tokenId} para:`, recipient.address);

    // Transferir después de aprobar
    const transferTx = await myNFT.transferFrom(owner.address, recipient.address, tokenId);
    await transferTx.wait();
    console.log(`Transferido el NFT con ID ${tokenId} a:`, recipient.address);

    // Verificar nuevo dueño
    const newOwner = await myNFT.ownerOf(tokenId);
    console.log(`El nuevo dueño del NFT con ID ${tokenId} es:`, newOwner);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
