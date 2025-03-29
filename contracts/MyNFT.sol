// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, ERC721URIStorage, Ownable(msg.sender) {
    uint256 private _nextTokenId; // ✅ Declarado correctamente dentro del contrato.
    uint256 private totalMinted;
    uint256 public constant MAX_SUPPLY = 10000;

    constructor() ERC721("MyNFT", "MNFT") {}

    function mintNFT(address recipient, string memory uri) public onlyOwner returns (uint256) {
        require(totalMinted < MAX_SUPPLY, "Max supply reached");

        uint256 tokenId = totalMinted + 1;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, uri);

        totalMinted++;

        return tokenId;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage) // ✅ Ahora sí anula ambos contratos.
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage) // ✅ Corregido
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}