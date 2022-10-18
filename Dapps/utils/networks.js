const networks = async () => {
  const response = await fetch('https://chainid.network/chains.json');

  let data;
  if (response.status >= 200 && response.status < 300) {
    data = await response.json();
  } else {
    console.log(response.statusText);
  }
  let chains = {};
  for (let i = 0; i < data.length; i++) {
    const chain = data[i];
    chains[chain.chainId] = {
      chainId: '0x' + Number(chain.chainId).toString(16),
      chainName: chain.name,
      nativeCurrency: chain.nativeCurrency,
      rpcUrls:
        chain.rpc !== undefined
          ? chain.rpc
          : ['https://mainnet.infura.io/v3/${INFURA_API_KEY}'],
      blockExplorerUrls:
        chain.explorers !== undefined
          ? [chain.explorers.length > 0 ? chain.explorers[0].url : '']
          : [],
    };
  }
  return chains;
};

export default networks;
