/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-04-11 10:20:48
 * @Description: 
 */
const {
  METADATA_URL,
  crpytodevsAddress,
  crpytodevAbi,
  developmentChains,
} = require('../helper-hardhat-config');
const { verify } = require('../utils/verify');
const fs = require('fs');
const { ethers } = require('hardhat');

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const whiltlist = await ethers.getContract('WhiteList');
  args = [METADATA_URL, whiltlist.address];
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
