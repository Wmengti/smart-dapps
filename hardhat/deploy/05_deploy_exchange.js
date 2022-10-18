const {
  exchangeAddress,
  exchangeAbi,
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
  const token = await ethers.getContract('CryptoDevToken');

  args = [token.address];
  const exchange = await deploy('Exchange', {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  fs.writeFileSync(exchangeAddress, JSON.stringify(exchange.address));
  const exchangeContract = await ethers.getContract('Exchange');
  fs.writeFileSync(
    exchangeAbi,
    exchangeContract.interface.format(ethers.utils.FormatTypes.json)
  );

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(exchange.address, args);
  }
};

module.exports.tags = ['all', 'exchange'];
