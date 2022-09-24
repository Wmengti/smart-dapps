const {
  crpytodevsTokenAddress,
  crpytodevTokenAbi,
  developmentChains,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');
const fs = require('fs');
const { ethers } = require('hardhat');
const cryptodevsNFTAddress = require('../../Dapps/constants/CDaddress.json');

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  args = [cryptodevsNFTAddress];
  const cryptodevToken = await deploy('CryptoDevToken', {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  fs.writeFileSync(
    crpytodevsTokenAddress,
    JSON.stringify(cryptodevToken.address)
  );
  const cdtokenContract = await ethers.getContract('CryptoDevToken');
  fs.writeFileSync(
    crpytodevTokenAbi,
    cdtokenContract.interface.format(ethers.utils.FormatTypes.json)
  );

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(cryptodevToken.address, args);
  }
};

module.exports.tags = ['all', 'cryptodevstoken'];
