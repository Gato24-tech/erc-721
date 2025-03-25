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

    it("Debe permitir transferir un NFT", async function () {
        await nft.mintNFT(owner.address);
        await nft.transferFrom(owner.address, addr1.address, 0);
        expect(await nft.ownerOf(0)).to.equal(addr1.address);
    });

    it("Debe evitar que un usuario transfiera un NFT que no posee", async function () {
        await nft.mintNFT(owner.address);
        await expect(
            nft.connect(addr1).transferFrom(owner.address, addr2.address, 0)
        ).to.be.revertedWith("ERC721: caller is not owner nor approved");
    });
});
