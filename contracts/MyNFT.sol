//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable(msg.sender) {
    uint256 private _nextTokenId;

constructor() ERC721("MyNFT", "MNFT") {}

function mint(address to) external onlyOwner {
    uint256 tokenId = _nextTokenId;
    _nextTokenId++;
    _safeMint(to, tokenId);
   }

}

