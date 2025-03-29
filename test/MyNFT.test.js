const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
    let MyNFT, nft, owner, addr1, addr2;

    beforeEach(async function () {
        // Obtener las cuentas de prueba
        [owner, addr1, addr2] = await ethers.getSigners();

        // Desplegar el contrato
        MyNFT = await ethers.getContractFactory("MyNFT");
        nft = await MyNFT.deploy();
        await nft.waitForDeployment();
    });

    it("Debe mintear un NFT al dueño", async function () {
        await nft.mintNFT(owner.address);
        expect(await nft.balanceOf(owner.address)).to.equal(1);
    });

    it("Debe mintear un NFT con URI", async function () {
        const uri = "ipfs://exampleUri";
        await MyNFT.mintNFT(owner.address, uri);

        expect(await MyNFT.tokenUri(1)).to.equal(uri);
    });

    it("Debe permitir transferir un NFT", async function () {
        await nft.mintNFT(owner.address);
        await nft.transferFrom(owner.address, addr1.address, 0);
        expect(await nft.ownerOf(0)).to.equal(addr1.address);
    });

    it("Debe evitar que un usuario transfiera un NFT que no posee", async function () {
        await nft.mintNFT(owner.address);
        const tokenId = 0;
        await expect(nft.connect(addr1).transferFrom(owner.address, addr1.address, tokenId))
        .to.be.reverted;
    });

    it("Debe fallar si un usuario intenta mintear", async function() {
    await expect(MyNFT.connect(addr).mintNFT(addr1.address, "ipfs://exampleUri")).to.be.revertedWith("Ownable: caller is not the owner");
});
});