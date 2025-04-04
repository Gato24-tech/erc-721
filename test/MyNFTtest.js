const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("MyNFT", function () {
   let MyNFT, nft, owner, addr1, addr2;


   beforeEach(async function () {
       // Obtener las cuentas de prueba
       [owner, addr1, addr2] = await ethers.getSigners();
       MyNFT = await ethers.getContractFactory("MyNFT");
       nft = await MyNFT.deploy();
       await nft.waitForDeployment();
   });


   it("Debe mintear un NFT al dueño", async function () {
       const uri = "ipfs://exampleUri";
       await nft.mintNFT(owner.address, uri);
       expect(await nft.balanceOf(owner.address)).to.equal(1);
   });


   it("Debe mintear un NFT con URI", async function () {
       const uri = "ipfs://exampleUri";
       await nft.mintNFT(owner.address, uri);
       expect(await nft.tokenURI(1)).to.equal(uri);
   });


   it("Debe permitir transferir un NFT", async function () {
       const uri = "ipfs://exampleUri";
       await nft.mintNFT(owner.address, uri);
       await nft.transferFrom(owner.address, addr1.address, 0);
       expect(await nft.ownerOf(0)).to.equal(addr1.address);
   });


   it("Debe evitar que un usuario transfiera un NFT que no posee", async function () {
       const uri = "ipfs://exampleUri";
       await nft.mintNFT(owner.address, uri);
       const tokenId = 0;
       await expect(nft.connect(addr1).transferFrom(owner.address, addr1.address, tokenId)).to.be.reverted;
   });


   it("Debe fallar si un usuario intenta mintear", async function() {
    await expect(nft.connect(addr1).mintNFT(addr1.address, "ipfs://exampleUri")).to.be.revertedWith,CustomError(nft, "Unauthorized");
});
});


