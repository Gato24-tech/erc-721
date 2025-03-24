const hre = require("hardhat");

async function main() {
    // Dirección del contrato desplegado (ajústala si es diferente)
    const contractAddress = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";  

    // Obtener la fábrica del contrato
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");

    // Adjuntar el contrato ya desplegado en lugar de volver a desplegarlo
    const myNFT = MyNFT.attach(contractAddress);
    console.log("Contrato NFT adjuntado en:", contractAddress);

    // Obtener el dueño del contrato
    const [owner] = await hre.ethers.getSigners();
    console.log("Interactuando como:", owner.address);

    // Mint NFT a la dirección del owner
    const mintTx = await myNFT.mint(owner.address);
    await mintTx.wait();
    console.log("NFT minteado para:", owner.address);

    // Obtener el balance del dueño
    const balance = await myNFT.balanceOf(owner.address);
    console.log("Balance de NFTs del dueño:", balance.toString());
}

// Llamar a main() correctamente
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
