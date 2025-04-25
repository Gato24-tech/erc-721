let signer;
let contract; 
let contractAddress;

const connectBtn = document.getElementById("connect");
const mintBtn = document.getElementById("mint");
const walletP = document.getElementById("wallet");
const statusP = document.getElementById("status");

// Cargar contrato al iniciar
async function loadContract() {
  try {
  const resAbi = await fetch("abi.json");
  const abiJson = await resAbi.json();
  const abi = abiJson.abi;

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

 let userAccount = null;
// Conectar wallet
connectBtn.onclick = async () => {
  try {
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
   const address = await signer.getAddress();
  walletP.innerText = `🔗 Connected as: ${address}`;
  // Cargamos el ABI y la dirección del contrato
  const resAbi = await fetch("abi.json");
  const abiJson = await resAbi.json();
  const abi = abiJson.abi;

  const resAddr = await fetch("MyDeploy.json");
  const addrJson = await resAddr.json();
  contractAddress = addrJson.address;

  // Creamos el contrato con el nuevo signer
  contract = new ethers.Contract(contractAddress, abi, signer);
  console.log("Contrato reconfigurado tras conectar con MetaMask");
} catch (err){ 
  console.error("Wallet connection error:", err);
  walletP.innetText = "Error al conectar wallet.";
}
};

async function checkBalance() {
  if (!contract || !signer) {
    return alert("Primero conecta tu wallet.");
  }

  try {
    const userAddress = await signer.getAddress();
    const balance = await contract.balanceOf(userAddress);
    document.getElementById("nft-info").innerText = `Tienes ${balance.toString()} NFT(s)`;
  } catch (error) {
    console.error("Error al consultar el balance:",error);
    document.getElementById("nft-info").innerText = "Error al obetener el balance.";
  }
  }

  async function displayOwnerNFT() {
    const tokenIds = await contract.methods.tokenOfOwner(currentAccount).call();

    const nftContainer = document.getElementById("nft-container");
    nftContainer.innerHTML = ""; // Limpiar antes de renderizar

    for (let tokenId of tokenIds) {
      const tokenUri = await contract.methods.tokenURI(tokenId).call();

      try {
        const response = await fetch(tokenUri);
        const metadata = await response.json();

        const nftCard = document.createElement("div");
        nftCard.className = "nft-card";
         nftCard.innerHTML = `
            <img src="${metadata.image}" alt="NFT ${tokenId}" width="200"/>
            <h3>${metadata.name}"</h3>
            <p>${metadata.description}</p>
            <small>ID: ${tokenId}</small>
         `;

         nftContainer.appendChild(nftCard);
        }catch (error) {
         console.error("Error al cargar metadata para tokenId", token, error);
        }
      }
    }
  
  async function getMyTokens() {
  if (!contract || !signer) {
    return alert("Primero conecta tu wallet.");
  } 
   try {
    const userAddress = await signer.getAddress();
    const maxSupply = await contract.maxSupply();
    const ownedTokens = [];

    for (let tokenId = 0; token < maxSupply; tokenId++) {
      const owner = await contract.ownerOf(tokenId).catch(() => null);
      if (owner && owner.toLowerCase() === userAddress.toLowerCase()) {
        ownedTokens.push(tokenId);
      }
    }

    if(ownedTokens.length > 0) {
      document.getElementById("nft-info").innertext =
        `Tus token IDs: ${ownedTokens.join(", ")}`;
    } else {
      document.getElementById("nft-info").innerText = "No tienes ningún NFT aún.";
    }
  }catch (error) {
    console.error("Error al obtener tus tokens:", error);
    document.getElementById("nft-info").innerText = "Error al obtener tus tokens.";
  }
}
 
  //mint NFT con pago y mostrar imagen

  async function mintNFT() {
    if (!window.ethereum || !currentAccount) {
      alert("Por favor, conecta MetaMask primero.");
      return;
    }

    try {
      const mintTX = await contract.methods.mintWhitPayment().send( {
        from: currentAccount,
        value: web3.utils.toWei("0.0001", "ether") // El valor exacto que exigimos en el contrato
      });

      console.log("Transacción", mintTx);

      //Despues del mint, consultamos los tokens que tiene el usuario
      const ownedTokens = await contract.methods.tokenOfOwner(currentAccount).call();
      const lastTokenId = ownedTokens[ownedTokens.length - 1]; //el último minteado

      console.log("Último token ID:", lastTokenId);

      const tokenURI = await contract.methods.tokenURi(lastTokenId).call();
      console.log("tokenURI:", tokenURI);
      
      document.getElementById("nft-image").src = tokenURI;
      document.getElementById("mint-status").textContent = "NFT minteado y cargado";

    } catch (error) {
      console.error("Error al mintear NFT:", error);
      document.getElementById("mint.status").textContent = "Error al mintear NFT";
    }
  }

async function showTokenImage() {
  if (!contract || !signer) {
    return alert("Please connect your wallet first.");
  }

  try {
    const userAddress = await signer.getAddress();
    const maxSupply = await contract.maxSupply();
    let foundTokenId = null;

    for (let tokenId = 0; tokenId < maxSupply; tokenId++) {
      const owner = await contract.ownerOf(tokenId).catch(() =>null);
      if (owner && owner.toLowerCase() === userAddress.toLowerCase()) {
        foundTokenId = tokenId;
        break;
      }
    }
     
    if (foundTokenId !== null) {
      const tokenURI = await contract.tokenURI(foundTokenId);
      console.log("tokenURI:", tokenURI);
      const response = await fetch(tokenURI);
      const metadata = await response.json();
      console.log("metadataJSON:", metadata);
      const imageUrl = metadata.image;

      document.getElementById("nft-info").innerHTML = `
      <strong>Token ID:</strong> ${foundTokenId}<br>
      <img src="${imageUrl}" alt="NFT Image" style="max-width: 300px; margin-top: 10px;" />
      `;

    } else {
      document.getElementById("nft-info").innerText = "You don't own any NFT yet.";
    }
  } catch (error) {
    console.error("Error displaying NFT image:", error);
    document.getElementById("nft-info").innerText = "Failet to fetch NFT image.";
  }

   window.onload = async () => {
   await loadContract();
}
}