/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-04-11 10:12:12
 * @Description: 
 */

const { ethers } = require('hardhat');

async function pause() {
  const cryptodevs = await ethers.getContract('CryptoDevs');
  const tx = await cryptodevs.setPaused();
  await tx.wait(1);
  console.log(`the mint is paused, transaction is ${tx}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
pause().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
