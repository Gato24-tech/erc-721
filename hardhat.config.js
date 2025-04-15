require("@nomicfoundation/hardhat-toolbox");

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
        url: `https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
        accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      },
    }
  }
  

