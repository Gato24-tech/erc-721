require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  
    solidity: {
      version: "0.8.28",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    },
    networks: {
      localhost: {
        url: "http://127.0.0.1:8545"
      },
      arbitrumSepolia: {
        url: `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      },
    }
  }
  

