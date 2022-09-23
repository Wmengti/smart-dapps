const developmentChains = ['hardhat', 'localhost'];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
const whitelistAddress = '../Dapps/constants/WLaddress.json';
const whitelistAbi = '../Dapps/constants/WLabi.json';
const METADATA_URL = 'https://nft-collection-sneh1999.vercel.app/api/';

const crpytodevsAddress = '../Dapps/constants/CDaddress.json';
const crpytodevAbi = '../Dapps/constants/CDabi.json';

module.exports = {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  whitelistAbi,
  whitelistAddress,
  METADATA_URL,
  crpytodevsAddress,
  crpytodevAbi,
};
