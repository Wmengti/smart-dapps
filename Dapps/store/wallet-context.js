import React, { useState, useEffect, useRef } from 'react';
import networks from '../utils/networks';
import { providers, Contract, utils } from 'ethers';
import whitelistABI from '../constants/WLabi.json';
import whitelistAddress from '../constants/WLaddress.json';
import cryptodevsABI from '../constants/CDabi.json';
import cryptodevsAddress from '../constants/CDaddress.json';
import tokenABI from '../constants/CDTokenAbi.json';
import tokenAddress from '../constants/CDTokenAddress.json';
import daoABI from '../constants/daoAbi.json';
import daoAddress from '../constants/daoAddress.json';
import exchangeABI from '../constants/exchangeAbi.json';
import exchangeAddress from '../constants/exchangeAddress.json';

const WalletContext = React.createContext({
  walletConnect: false,
  provider: null,
  account: null,
  signer: null,
  chainId: '',
  CDContract: null,
  CDAddress: '',
  CDTokenContract: null,
  CDTokenAddress: '',
  DAOContract: null,
  DAOAddress: '',
  ExchangeContract: null,
  ExchangeAddress: '',
  WLContract: null,
  WLAddress: '',
  ethBalance: '0',
  ethBalanceContract: '0',
  cdBalance: '0',
  lpBalance: '0',
  reservedCD: '0',
  lpBalanceContract: null,
  connectWallet: (web3Modal) => {},
  disconnect: (web3Modal) => {},
  switchNetwork: (networkId) => {},
  getAmounts: () => {},
  voteID: 0,
  newId: () => {},
});

export const WalletContextProvider = (props) => {
  const [walletConnect, setWalletConnct] = useState(false);
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState('');
  const [CDContract, setCDContract] = useState();
  const [CDAddress, setCDAddress] = useState('');
  const [CDTokenContract, setCDTokenContract] = useState();
  const [CDTokenAddress, setCDTokenAddress] = useState('');
  const [DAOContract, setDAOContract] = useState();
  const [DAOAddress, setDAOAddress] = useState('');
  const [ExchangeContract, setExchangeContract] = useState();
  const [ExchangeAddress, setExchangeAddress] = useState('');
  const [WLContract, setWLContract] = useState();
  const [WLAddress, setWLAddress] = useState();
  const [ethBalance, setEthBalance] = useState('0');
  const [ethBalanceContract, setEtherBalanceContract] = useState('0');
  const [cdBalance, setCDBalance] = useState('0');
  const [lpBalance, setLPBalance] = useState('0');
  const [reservedCD, setReservedCDBalance] = useState('0');
  const [lpBalanceContract, setLPBalanceContract] = useState('0');
  const [voteId, setVoteId] = useState(0);
  let chains;
  const getSignerRef = useRef();

  const newId = () => {
    setVoteId((prev) => prev + 1);
  };

  const getAmounts = async () => {
    try {
      const _ethBalance = await provider.getBalance(account);
      const _ethBalanceContract = await provider.getBalance(ExchangeAddress);
      const _lpBalanceContract = await ExchangeContract.totalSupply();
      const _cdBalance = await CDTokenContract.balanceOf(account);
      const _lpBalance = await ExchangeContract.balanceOf(account);
      const _reservedCD = await ExchangeContract.getReserve();
      setEthBalance(utils.formatEther(_ethBalance).toString());
      setEtherBalanceContract(
        utils.formatEther(_ethBalanceContract).toString()
      );
      setLPBalanceContract(utils.formatEther(_lpBalanceContract).toString());
      setCDBalance(utils.formatEther(_cdBalance).toString());
      setLPBalance(utils.formatEther(_lpBalance).toString());
      setReservedCDBalance(utils.formatEther(_reservedCD).toString());
    } catch (e) {
      console.error(e);
    }
  };
  const switchNetwork = async (networkId) => {
    try {
      console.log(chains[networkId].chainId);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chains[networkId].chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            mothod: 'wallet_addEthereumChain',
            params: [
              {
                ...chains[networkId],
              },
            ],
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  const connectWalletHandler = async (web3Modal) => {
    try {
      const provider = await web3Modal.connect();
      setWalletConnct(true);
      const web3Provider = new providers.Web3Provider(provider);
      setProvider(web3Provider);
      // const getsigner = web3Provider.getSigner();
      // setSigner(getsigner);
      getSignerRef.current = web3Provider.getSigner();
      setSigner(getSignerRef.current);
      const accounts = await web3Provider.listAccounts();
      if (accounts) {
        setAccount(accounts[0]);
      }
      const { chainId } = await web3Provider.getNetwork();
      chains = await networks();
      if (chainId !== 5) {
        await switchNetwork(5);
      }
      setChainId(chainId.toString(10));
      // await creatContract(getsigner);
      creatContract();
    } catch (e) {
      console.error(e);
    }
  };

  const disconnectHandler = async (web3Modal) => {
    await web3Modal.clearCachedProvider();
    setAccount();
    setProvider();
    setSigner();
  };

  const creatContract = () => {
    // const CDcontract = new Contract(cryptodevsAddress, cryptodevsABI, signer);
    const CDcontract = new Contract(
      cryptodevsAddress,
      cryptodevsABI,
      getSignerRef.current
    );
    setCDContract(CDcontract);
    setCDAddress(cryptodevsAddress);
    const WLcontract = new Contract(
      whitelistAddress,
      whitelistABI,
      getSignerRef.current
    );
    setWLContract(WLcontract);
    setWLAddress(whitelistAddress);
    const Tokencontract = new Contract(
      tokenAddress,
      tokenABI,
      getSignerRef.current
    );
    setCDTokenContract(Tokencontract);
    setCDTokenAddress(tokenAddress);
    const DAOcontract = new Contract(daoAddress, daoABI, getSignerRef.current);
    setDAOContract(DAOcontract);
    setDAOAddress(daoAddress);
    const Exchangecontract = new Contract(
      exchangeAddress,
      exchangeABI,
      getSignerRef.current
    );
    setExchangeContract(Exchangecontract);
    setExchangeAddress(exchangeAddress);
  };

  if (typeof window !== 'undefined') {
    useEffect(() => {
      if (window.ethereum?.on) {
        const handleAccountsChanged = (accounts) => {
          console.log('accountsChanged', accounts);
          if (accounts) setAccount(accounts[0]);
        };

        const handleDisconnect = () => {
          console.log('disconnect', error);
          setWalletConnct(false);
        };

        const handleChainChanged = (_hexChainId) => {
          const _chainId = _hexChainId.toString(10);
          setChainId(_chainId);
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('disconnect', handleDisconnect);
        window.ethereum.on('chainChanged', handleChainChanged);
        return () => {
          if (window.ethereum.removeListener) {
            window.ethereum.removeListener(
              'accountsChanged',
              handleAccountsChanged
            );
            window.ethereum.removeListener('disconnect', handleDisconnect);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
          }
        };
      }
    }, [window.ethereum]);
  }

  return (
    <WalletContext.Provider
      value={{
        walletConnect: walletConnect,
        provider: provider,
        account: account,
        signer: signer,
        chainId: chainId,
        CDContract: CDContract,
        CDAddress: CDAddress,
        CDTokenContract: CDTokenContract,
        CDTokenAddress: CDTokenAddress,
        DAOContract: DAOContract,
        DAOAddress: DAOAddress,
        ExchangeContract: ExchangeContract,
        ExchangeAddress: ExchangeAddress,
        WLContract: WLContract,
        WLAddress: WLAddress,
        connectWallet: connectWalletHandler,
        disconnect: disconnectHandler,
        switchNetwork: switchNetwork,
        getAmounts: getAmounts,
        ethBalance: ethBalance,
        ethBalanceContract: ethBalanceContract,
        cdBalance: cdBalance,
        lpBalance: lpBalance,
        reservedCD: reservedCD,
        lpBalanceContract: lpBalanceContract,
        newId: newId,
        voteID: voteId,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
