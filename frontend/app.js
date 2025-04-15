let signer;
let contract;

const connectBtn = document.getElementById("connect");
const mintBtn = document.getElementById("mint");
const walletP = document.getElementById("wallet");
const statusP = document.getElementById("status");

// Conectar Metamask
connectBtn.onclick = async () => {
  if (!window.ethereum) return alert("Instala MetaMask, por favor.");

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  walletP.innerText = `🔗 Conectado como: ${await signer.getAddress()}`;

  const res = await fetch("abi.json");
  const abiJson = await res.json();
  const abi = abiJson.abi;

  const contractAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"; // cambia por la dirección real
  contract = new ethers.Contract(contractAddress, abi, signer);
};

// Botón para mintear NFT
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

// Mostrar número de NFTs y sus imágenes (si es posible)
async function mostrarNFTs() {
  if (!window.ethereum || !contract) {
    alert("Por favor, conecta primero Metamask.");
    return;
  }

  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const userAddress = accounts[0];

  try {
    const balance = await contract.balanceOf(userAddress);
    document.getElementById("nft-info").innerText =
      `Tienes ${balance.toString()} NFT(s) en tu cuenta.`;

    const idsContainer = document.getElementById("nft-ids");
    idsContainer.innerHTML = "";
    const gallery = document.getElementById("nft-gallery");
    gallery.innerHTML = "";

    for (let i = 0; i < balance; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i); // SOLO funciona si usas ERC721Enumerable
      const uri = await contract.tokenURI(tokenId);
      const res = await fetch(uri);
      const metadata = await res.json();

      const li = document.createElement("li");
      li.innerText = `Token ID: ${tokenId}`;
      idsContainer.appendChild(li);

      const img = document.createElement("img");
      img.src = metadata.image;
      img.alt = metadata.name;
      img.style.width = "200px";
      img.style.margin = "10px";
      gallery.appendChild(img);
    }
  } catch (err) {
    console.error("Error mostrando NFTs:", err);
    document.getElementById("nft-info").innerText =
      "Error mostrando tus NFTs. ¿Tienes ERC721Enumerable?";
  }
}
