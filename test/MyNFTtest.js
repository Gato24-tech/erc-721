const { expect } = require("chai");
const { ethers } = require("hardhat");
const path  = require("path");
const fs  = require("fs");

describe("MyNFT", function () {
    let nft, owner, addr1;
  
    beforeEach(async () => {
      [owner, addr1] = await ethers.getSigners();
      const MyNFT = await ethers.getContractFactory("MyNFT");
      nft = await MyNFT.deploy("ipfs://baseuri/", 10);
      await nft.waitForDeployment();
    });
  
    it("Debe mintear un NFT al dueño", async function () {
      await nft.mint();
      expect(await nft.ownerOf(1)).to.equal(owner.address);
    });
  
    it("Debe fallar si un usuario intenta mintear", async function () {
      await expect(nft.connect(addr1).mint()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  
    it("Debe bloquear transferencia si el token está bloqueado", async function () {
      await nft.mint();
      await nft.lockToken(1);
      await expect(
        nft.transferFrom(owner.address, addr1.address, 1)
      ).to.be.revertedWith("Token is locked");
    });
  
    it("Debe permitir transferir si el token está desbloqueado", async function () {
      await nft.mint();
      await nft.approve(addr1.address, 1);
      await nft.connect(addr1).transferFrom(owner.address, addr1.address, 1);
      expect(await nft.ownerOf(1)).to.equal(addr1.address);
    });
  
    it("Debe fallar si usuario no autorizado intenta bloquear token", async function () {
      await nft.mint();
      await expect(nft.connect(addr1).lockToken(1)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
  