const {
  METADATA_URL,
  crpytodevsAddress,
  crpytodevAbi,
  developmentChains,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');
const fs = require('fs');
const { ethers } = require('hardhat');
const whitelistAddress = require('../../Dapps/constants/WLaddress.json');

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  args = [METADATA_URL, whitelistAddress];
  const cryptodevs = await deploy('CryptoDevs', {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  fs.writeFileSync(crpytodevsAddress, JSON.stringify(cryptodevs.address));
  const cdContract = await ethers.getContract('CryptoDevs');
  fs.writeFileSync(
    crpytodevAbi,
    cdContract.interface.format(ethers.utils.FormatTypes.json)
  );

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(cryptodevs.address, args);
  }
};

module.exports.tags = ['all', 'cryptodevs'];
