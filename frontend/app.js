let signer;
let contract;
let contractAddress;
let abi;
let currentAccount = null;

const connectBtn = document.getElementById("connect");
const mintPublicBtn = document.getElementById("mintPublicBtn");
const mintOwnerBtn = document.getElementById("mintOwnerBtn");
const walletP = document.getElementById("wallet");

// Cargar contrato al iniciar
async function loadContract() {
  try {
    const resAbi = await fetch("abi.json");
    const abiJson = await resAbi.json();
    abi = abiJson.abi;

    const resAddr = await fetch("MyDeploy.json");
    const addrJson = await resAddr.json();
    contractAddress = addrJson.address;
    console.log("📡 Contract address loaded:", contractAddress);

    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      contract = new ethers.Contract(contractAddress, abi, signer);
    } else {
      alert("Please install Metamask to continue.");
    }
  } catch (error) {
    console.error("Error loading contract:", error);
  }
}

// Conectar wallet
connectBtn.onclick = async () => {
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    currentAccount = accounts[0];

    await loadContract(); // Cargar contrato al conectar

    walletP.innerText = `🔗 Connected as: ${currentAccount}`;
  } catch (err) {
    console.error("Wallet connection error:", err);
    walletP.innerText = "❌ Error al conectar wallet.";
  }
};

// Mint con pago
mintPublicBtn.onclick = async () => {
  try {
    const tx = await contract.mintWithPayment({
      value: ethers.parseEther("0.0001"),
    });
    await tx.wait();
    alert("✅ NFT minteado con pago.");
  } catch (err) {
    console.error("Error al mintear con pago:", err);
    alert("❌ Error al mintear con pago.");
  }
};

// Mint gratis para owner
mintOwnerBtn.onclick = async () => {
  try {
    const owner = await contract.owner();
    if (currentAccount.toLowerCase() !== owner.toLowerCase()) {
      alert("❌ Solo el owner puede usar esta función gratuita.");
      return;
    }

    const tx = await contract.mint();
    await tx.wait();
    alert("✅ NFT minteado como owner.");
  } catch (err) {
    console.error("Error al mintear como owner:", err);
    alert("❌ Error al mintear como owner.");
  }
};

async function showTokenImage() {
  if (!contract || !signer) {
    return alert("Please connect your wallet first.");
  }

  try {
    const userAddress = await signer.getAddress();
    const maxSupply = await contract.maxSupply();
    let foundTokenId = null;

    for (let tokenId = 0; tokenId < maxSupply; tokenId++) {
      const owner = await contract.ownerOf(tokenId).catch(() => null);
      if (owner && owner.toLowerCase() === userAddress.toLowerCase()) {
        foundTokenId = tokenId;
        break;
      }
    }

    if (foundTokenId !== null) {
      const tokenURI = await contract.tokenURI(foundTokenId);
      const gatewayUrl = tokenURI.replace("ipfs://","https://gateway.lighthouse.storage/ipfs/");
      const response = await fetch(gatewayURL);
      const metadata = await response.json();
      const imageUrl = metadata.image.replace("ipfs://", "https://gateway.lighthouse.storage/ipfs/");

      document.getElementById("nft-info").innerHTML = `
        <strong>Token ID:</strong> ${foundTokenId}<br>
        <img src="${imageUrl}" alt="NFT Image" style="max-width: 300px; margin-top: 10px;" />
      `;
    } else {
      document.getElementById("nft-info").innerText = "You don't own any NFT yet.";
    }
  } catch (error) {
    console.error("Error displaying NFT image:", error);
    document.getElementById("nft-info").innerText = "Failed to fetch NFT image.";
  }
}

async function checkIfPaused() {
  if (!contract) {
    return alert("Conecta tu wallet primero.");
  }

  try {
    const paused = await contract.paused();
    alert(paused ? "⚠️ El contrato está PAUSADO." : "✅ El contrato está ACTIVO.");
  } catch (error) {
    console.error("Error checking pause state:", error);
  }
}

async function getMintedCount() {
  if (!contract) {
    return alert("Conecta tu wallet primero.");
  }

  try {
    const totalMinted = await contract.totalMinted();
    alert(`🔢 Total NFTs minteados: ${totalMinted}`);
  } catch (error) {
    console.error("Error al obtener total minteado:", error);
  }
}

window.onload = async () => {
  await loadContract();
};
