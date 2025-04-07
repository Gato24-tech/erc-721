// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MyNFT is ERC721, ERC721URIStorage, Pausable, Ownable {
    uint256 public maxSupply; // Límite de NFTs que se pueden mintear
    uint256 private _tokenIdCounter; // Contador interno para IDs únicos
    string public baseURI; // URI base para construir URIs dinámicas
    mapping(uint256 => bool) public lockedTokens; // Tokens bloqueados para transferencia

    constructor(string memory _baseURI, uint256 _maxSupply) ERC721("MyNFT", "MNFT") {
        baseURI = _baseURI; // Asigna URI base al desplegar
        maxSupply = _maxSupply; // Define el máximo de tokens
    }

    // 🧩 MINT: solo el owner puede mintear y si el contrato no está pausado
    function mint() public onlyOwner whenNotPaused {
        require(_tokenIdCounter < maxSupply, "Max supply reached");
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(msg.sender, tokenId); // Mintea al owner

        string memory newURI = string(abi.encodePacked(baseURI, uint2str(tokenId))); // URI dinámica
        _setTokenURI(tokenId, newURI);
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
