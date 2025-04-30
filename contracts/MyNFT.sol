// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/Counters.sol"; 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MyNFT is ERC721, ERC721URIStorage, Pausable, Ownable {
    uint256 public maxSupply; // Límite de NFTs que se pueden mintear
    string public baseURI; // URI base para construir URIs dinámicas
    mapping(uint256 => bool) public lockedTokens; // Tokens bloqueados para transferencia
    uint256 public nftPrice = 0.0001 ether; // Precio por NFT configurable por el owner
    using Counters for Counters.Counter; // Habilita funciones tipo objeto en el struct
    Counters.Counter private _tokenIdCounter; // Define el contador real



    constructor(string memory _baseUri, uint256 _maxSupply) ERC721("MyNFT", "MNFT") {
        baseURI = _baseUri; // Asigna URI base al desplegar
        maxSupply = _maxSupply; // Define el máximo de tokens
    }

    function mintWithPayment() external payable whenNotPaused {
    require(msg.value >= nftPrice, "No has enviado suficiente ETH");
    // Asegura que el comprador ha enviado suficiente ether

    require(_tokenIdCounter.current() < maxSupply, "Max supply reached");
    // Asegura que no se supere el límite de NFTs
    
    _tokenIdCounter.increment(); // Aumenta el contador para nuevo token
    uint256 newItemId = _tokenIdCounter.current(); // Obtiene el nuevo ID
    _safeMint(msg.sender, newItemId); // Mintea el NFT al comprador
}

    function tokenOfOwner(address _owner) public view returns (uint256[] memory) {
        uint256 count = balanceOf(_owner);
        uint256[] memory tokens = new uint256[](count);
        uint256 found = 0;
        for (uint256 i = 1; i <= maxSupply; i++) {
            if (_exists(i) && ownerOf(i) ==_owner) {
                tokens[found] = i;
                found++;
                if (found == count) {
                    break;
                }
            }
        }
        return tokens;
    }


 
    // Obligatorio override porque heredamos múltiples contratos con _burn()
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
         // 🧩 MINT: solo el owner puede mintear y si el contrato no está pausado
   function mint() public onlyOwner whenNotPaused {
    require(_tokenIdCounter.current() < maxSupply, "Max supply reached");

    _tokenIdCounter.increment(); // incrementa correctamente
    uint256 tokenId = _tokenIdCounter.current(); // obtiene el nuevo ID

    _safeMint(msg.sender, tokenId); // mintea al owner

    string memory newURI = string(abi.encodePacked(baseURI, uint2str(tokenId))); // URI dinámica
    _setTokenURI(tokenId, newURI);
}

    function totalMinted() public view returns (uint256) {
        return _tokenIdCounter.current();

    }

    // 🔒 Bloquea el token para evitar transferencias
    function lockToken(uint256 tokenId) external onlyOwner {
        require(ownerOf(tokenId) == msg.sender || getApproved(tokenId) == msg.sender, "Not authorized");
        lockedTokens[tokenId] = true;
    }

    // 🔓 Desbloquea el token
    function unlockToken(uint256 tokenId) external onlyOwner {
        require(ownerOf(tokenId) == msg.sender || getApproved(tokenId) == msg.sender, "Not authorized");
        lockedTokens[tokenId] = false;
    }

    // ⏸️ Pausa el contrato (solo funciones sensibles)
    function pause() public onlyOwner {
        _pause(); // heredado de Pausable
    }

    // ▶️ Despausa el contrato
    function unpause() public onlyOwner {
        _unpause();
    }

    // 🚫 Sobrescribimos transferencias para bloquear tokens y pausar
    function transferFrom(address from, address to, uint256 tokenId) 
        public 
        override(IERC721, ERC721) 
        whenNotPaused 
    {
        require(!lockedTokens[tokenId], "Token is locked");
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) 
        public 
        override(IERC721, ERC721) 
        whenNotPaused 
    {
        require(!lockedTokens[tokenId], "Token is locked");
        super.safeTransferFrom(from, to, tokenId, data);
    }

    // 🔧 Convierte uint a string para construir URIs
    function uint2str(uint _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";
        uint j = _i;
        uint len;
        while (j != 0) { len++; j /= 10; }
        bytes memory bstr = new bytes(len);
        uint k = len;
        j = _i;
        while (j != 0) {
            k = k - 1;
            bstr[k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }

    // 🔁 Obligatorios por herencia múltiple
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}
