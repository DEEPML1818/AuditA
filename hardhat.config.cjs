require("@nomiclabs/hardhat-ethers");
module.exports = {
  solidity: "0.8.0",
  networks: {
    iotaledger: {
      url: "json-rpc.evm.testnet.iotaledger.net",
      chainId: 1075,
      accounts: ['18a090486be8cc042d0f3b9a3e7d76c54f2d6055f9ecb741359b12baa700c062'],
    },
  },
};
