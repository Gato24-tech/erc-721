let signer;
let contract; // Ahora sí es global
let contractAddress;

const connectBtn = document.getElementById("connect");
const mintBtn = document.getElementById("mint");
const walletP = document.getElementById("wallet");
const statusP = document.getElementById("status");

// Cargar contrato al iniciar
async function loadContract() {
  const resAbi = await fetch("abi.json");
  const abiJson = await resAbi.json();
  const abi = abiJson.abi;

  const resAddr = await fetch("MyDeploy.json");
  const addrJson = await resAddr.json();
  contractAddress = addrJson.address;
  console.log("📡 Dirección del contrato cargada:", contractAddress);

  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
  } else {
    alert("Instala MetaMask para continuar");
  }
}

window.onload = async () => {
  await loadContract();
};

// Conectar wallet
connectBtn.onclick = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  walletP.innerText = `🔗 Conectado como: ${await signer.getAddress()}`;
};

// Mint
mintBtn.onclick = async () => {
  if (!contract) return alert("Primero conecta MetaMask.");
  statusP.innerText = "⏳ Mint en proceso...";

  try {
    const tx = await contract.mintWithPayment({ value: ethers.parseEther("0.01") });
    await tx.wait();
    statusP.innerText = "✅ NFT minteado correctamente!";
  } catch (err) {
    console.error(err);
    statusP.innerText = "❌ Error en el mint.";
  }
};
