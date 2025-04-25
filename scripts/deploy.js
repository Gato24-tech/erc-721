const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Red activa:", hre.network.name);

  const accounts = await hre.ethers.getSigners();
  console.log("Accounts disponibles:", accounts.map(a => a.address));

  if (!accounts.length) {
    throw new Error("No hay cuentas disponibles. ¿Está bien configurada la PRIVATE_KEY?");
  }

   // Argumentos para el constructor:
  const baseUri = "https://gateway.pinata.cloud/ipfs/QmRgAgZ9U5AZEdp3NrbVVWspnb5oEJW9v7UUTqRmWMoEwn/"; // Puedes poner un valor real o provisional
  const maxSupply = 10;

  const Contract = await hre.ethers.getContractFactory("MyNFT");

  const contract = await Contract.deploy(baseUri, maxSupply);
  await contract.waitForDeployment();

  console.log(`✅ NFT deployed to: ${await contract.getAddress()}`);

  // Guardar en frontend/MyDeploy.json
  const output = { address };
  fs.writeFileSync("frontend/MyDeploy.json", JSON.stringify(output, null, 2));
  console.log("📁 Dirección guardada en frontend/MyDeploy.json");
}

main().catch((error) => {
  console.error("Error al desplegar:", error);
  process.exit(1);
});
