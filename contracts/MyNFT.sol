// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MyNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 public maxSupply;
    bool public paused;
    mapping(uint256 => bool) public lockedTokens;

    constructor(uint256 _maxSupply) ERC721("MyNFT", "MNFT") Ownable(msg.sender) {
        maxSupply = _maxSupply;
    }

    function mint(string memory uri) external onlyOwner {
        require(!paused, "Contract is paused");
        require(_nextTokenId < maxSupply, "Max supply reached");

        _nextTokenId++;
        _safeMint(msg.sender, _nextTokenId);
        _setTokenURI(_nextTokenId, uri);
    }

    function lockToken(uint256 tokenId) external onlyOwner {
        require(ownerOf(tokenId) == msg.sender || getApproved(tokenId) == msg.sender, "Not authorized");
        lockedTokens[tokenId] = true;
    }

    function unlockToken(uint256 tokenId) external onlyOwner {
        require(ownerOf(tokenId) == msg.sender || getApproved(tokenId) == msg.sender, "Not authorized");
        lockedTokens[tokenId] = false;
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }

    function transferFrom(address from, address to, uint256 tokenId) 
        public 
        override(IERC721, ERC721) 
    {
        require(!lockedTokens[tokenId], "Token is locked");
        super.transferFrom(from, to, tokenId);
    }

    
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) 
        public 
        override(IERC721, ERC721) 
    { 
        require(!lockedTokens[tokenId], "Token is locked");
        super.safeTransferFrom(from, to, tokenId, data);
    }

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
