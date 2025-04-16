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

  const Contract = await hre.ethers.getContractFactory("MyNFT");
  const contract = await Contract.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ Contrato desplegado en:", address);

  // Guardar en frontend/MyDeploy.json
  const output = { address };
  fs.writeFileSync("frontend/MyDeploy.json", JSON.stringify(output, null, 2));
  console.log("📁 Dirección guardada en frontend/MyDeploy.json");
}

main().catch((error) => {
  console.error("Error al desplegar:", error);
  process.exit(1);
});
