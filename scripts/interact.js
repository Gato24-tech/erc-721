const hre  = require ("hardhat");


async function main() {
    // Conecto el contrato con owner y recipient
    const [owner, recipient] = await hre.getSigners();
    console.log("Address owner:", owner.address);
    console.log("Address recipient:", recipient.address);
    
    const contract = await hre.getContractAt("MyNFT", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

    // Leer información del contrato (ver saldo)
    const balance = await contract.getBalance();
    console.log("saldo actual:", hre.formatEther(balance), "ETH");

    // Realizamos una transferencia 
    const tx = await contract.deposit({ value: hre.parseEther("1")});
    await tx.wait();
    console.log("Deposito realizado!");

main().catch((error) => {
    console.error(Error);
    process.exitCode = 1;

}
)}
