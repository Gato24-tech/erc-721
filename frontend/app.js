
let signer;
let contract;

const connectBtn = document.getElementById("connect");
const mintBtn = document.getElementById("mint");
const walletP = document.getElementById("wallet");
const statusP = document.getElementById("status");

connectBtn.onclick = async () => {
  if (!window.ethereum) return alert("Instala MetaMask, por favor.");

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  walletP.innerText = `🔗 Conectado como: ${await signer.getAddress()}`;

  // Leer ABI y dirección
  const res = await fetch("abi.json");
  const abiJson = await res.json();
  const abi = abiJson.abi;

  const contractAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
  contract = new ethers.Contract(contractAddress, abi, signer);
};

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
  async function checkBalance() {

    if (!window.ethereum || !contract) {
      alert("Por favor, conecta primero Metamask.");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts"});
    const userAddress = accounts[0];

    try {
      const balance = await contract.balanceOf(userAddress);
      document.getElementById("nft-info").innerText =
      `Tienes ${balance.toString()} NFT(s) en tu cuenta.`;
    }catch (err) {
      console.error("Error al obtener el balance:", err);
      document.getElementById("nft-info").innerText =
        "No se pudo obtener el númeto de NFTs.";
    }
      
   }
