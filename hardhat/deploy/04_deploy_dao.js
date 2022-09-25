const {
  daoAddress,
  daoAbi,
  developmentChains,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');
const fs = require('fs');
const { ethers } = require('hardhat');
// const nftmarketAddress = require('../../Dapps/constants/nftmarketAddress.json');
// const crpytodevsAddress = require('../../Dapps/constants/CDaddress.json');
module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const cryptodevs = await ethers.getContract('CryptoDevs');
  const nftmarkt = await ethers.getContract('FackNFTMarketplace');

  args = [nftmarkt.address, cryptodevs.address];
  const dao = await deploy('DAO', {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  fs.writeFileSync(daoAddress, JSON.stringify(dao.address));
  const daoContract = await ethers.getContract('DAO');
  fs.writeFileSync(
    daoAbi,
    daoContract.interface.format(ethers.utils.FormatTypes.json)
  );

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(dao.address, args);
  }
};

module.exports.tags = ['all', 'DAO'];
