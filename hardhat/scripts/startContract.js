// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { METADATA_URL } = require('../helper-hardhat-config');
const { ethers } = require('hardhat');
const whitelistAddress = require('../../Dapps/constants/WLaddress.json');

async function start() {
  const cryptodevs = await ethers.getContract('CryptoDevs');
  const tx = await cryptodevs.startPresale(5);
  await tx.wait(1);
  console.log(`the mint is starting, transaction is ${tx}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
