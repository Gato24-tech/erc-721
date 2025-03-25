// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable(msg.sender) {

    uint256 private _nextTokenId;
    uint256 public constant MAX_SUPPLY = 10000;
    constructor() ERC721("MyNFT", "MNFT") {}
    uint256 private totalMinted;

    function mint(address to) public {
        require(totalMinted < MAX_SUPPLY, "Se ha alcanzado el max de NFTs disponibles.");
        uint256 tokenId = totalMinted;
        totalMinted++;
        _safeMint(to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721) // ✅ Solo ERC721
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
