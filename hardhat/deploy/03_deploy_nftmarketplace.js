const {
  nftmarketAddress,
  nftmarketAbi,
  developmentChains,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');
const fs = require('fs');
const { ethers } = require('hardhat');

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  args = [];
  const nftmarket = await deploy('FackNFTMarketplace', {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  fs.writeFileSync(nftmarketAddress, JSON.stringify(nftmarket.address));
  const nftmarketContract = await ethers.getContract('FackNFTMarketplace');
  fs.writeFileSync(
    nftmarketAbi,
    nftmarketContract.interface.format(ethers.utils.FormatTypes.json)
  );

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(nftmarket.address, args);
  }
};

module.exports.tags = ['all', 'DAO'];
