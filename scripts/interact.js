const hre = require("hardhat");

async function main() {
    try {
        // Conecto el contrato con owner y recipient
        const [owner, recipient] = await hre.ethers.getSigners();
        console.log("Address owner:", owner.address);
        console.log("Address recipient:", recipient.address);

        // Conectar con el contrato MyNFT
        const contract = await hre.ethers.getContractAt("MyNFT", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

        // Leer información del contrato (ver saldo)
        const balance = await contract.getBalance();
        console.log("Saldo actual:", hre.ethers.formatEther(balance), "ETH");

        // Realizamos una transferencia
        const tx = await contract.deposit({ value: hre.ethers.parseEther("1") });
        await tx.wait();
        console.log("Depósito realizado!");

        console.log("Script ejecutado correctamente");
    } catch (error) {
        console.error("Error en el script:", error);
        process.exitCode = 1;
    }
}

main();
