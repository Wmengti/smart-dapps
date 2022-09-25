import Head from 'next/head';
import styles from '../../styles/Token.module.css';

import Web3Modal from 'web3modal';
import { providers, Contract, utils } from 'ethers';
import { useState, useRef, useEffect } from 'react';

import cryptodevsABI from '../../constants/CDabi.json';
import cryptodevsAddress from '../../constants/CDaddress.json';
import tokenABI from '../../constants/CDTokenAbi.json';
import tokenAddress from '../../constants/CDTokenAddress.json';

export default function Tokens() {
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [nftowner, setNftOwner] = useState(false);
  const [tokenToBeClaimed, setTokenToBeClaimed] = useState(0);
  const [tokenMintOut, setTokenMintOut] = useState(false);
  const [tokensMinted, setTokenMinted] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);

  const web3ModalRef = useRef();
  if (typeof window !== 'undefined') {
    web3ModalRef.current = new Web3Modal({
      network: 'rinkeby',
      providerOptions: {},
      disableInjectedProvider: false,
    });
  }

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert('Change the network to Rinkeby');
      throw new Error('Change network to Rinkeby');
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (e) {
      console.error(e);
    }
  };

  const getTokenToBeClaimed = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();
      const cryptodevs = new Contract(cryptodevsAddress, cryptodevsABI, signer);
      const _balance = await cryptodevs.balanceOf(address);
      console.log(_balance.toString());
      const token = new Contract(tokenAddress, tokenABI, signer);
      if (_balance.toString() === '0') {
        setNftOwner(false);
        setTokenToBeClaimed(0);
      } else {
        setNftOwner(true);
        let count = 0;
        for (let i = 0; i < _balance; i++) {
          const nftIndex = await cryptodevs.tokenOfOwnerByIndex(address, i);
          const _isClaimed = await token.tokenIdsClaimed(nftIndex);
          if (!_isClaimed) {
            count++;
          }
        }
        setTokenToBeClaimed(count.toString());
      }
    } catch (e) {
      console.error(e);
      setTokenToBeClaimed(0);
    }
  };

  const getTotalTokensMinted = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const token = new Contract(tokenAddress, tokenABI, signer);
      const totalSupply = await token.totalSupply();
      const _tokensMinted = utils.formatEther(totalSupply);
      setTokenMinted(_tokensMinted);
      const _mintout = _tokensMinted === 10000 ? true : false;
      setTokenMintOut(_mintout);
    } catch (e) {
      console.error(e);
    }
  };

  const nftOwnerClaim = async () => {
    try {
      if (tokenToBeClaimed === 0) {
        window.alert('You have no token claim');
      }
      const signer = await getProviderOrSigner(true);
      const token = new Contract(tokenAddress, tokenABI, signer);
      const tx = await token.claim();
      setLoading(true);
      await tx.wait(1);
      setLoading(false);
      window.alert('You successfully Claim a Crypto Dev Token!');
      await getTokenToBeClaimed();
      await getTotalTokensMinted();
    } catch (e) {
      console.error(e);
    }
  };

  const publicMint = async (amount) => {
    try {
      const signer = await getProviderOrSigner(true);
      const token = new Contract(tokenAddress, tokenABI, signer);
      const totalValue = 0.001 * amount;
      const tx = await token.mint(amount, {
        value: utils.parseEther(totalValue.toString()),
      });
      setLoading(true);
      await tx.wait(1);
      setLoading(false);
      window.alert('You successfully Mint a Crypto Dev Token!');
      await getTokenToBeClaimed();
      await getTotalTokensMinted();
    } catch (e) {
      console.error(e);
    }
  };

  const mintButtonHandler = () => {
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }
    if (nftowner && !tokenMintOut) {
      return (
        <div>
          <button onClick={nftOwnerClaim} className={styles.button}>
            NFT OWNER CLAIM
          </button>
          <div>
            <input
              type='number'
              placeholder='Amount of Tokens'
              onChange={(event) => setTokenAmount(event.target.value)}
              className={styles.input}
            />
            <button
              onClick={() => publicMint(tokenAmount)}
              className={styles.button}
            >
              MINT TOKRNS
            </button>
          </div>
        </div>
      );
    }

    if (!nftowner && !tokenMintOut) {
      return (
        <div>
          <input
            type='number'
            placeholder='Amount of Tokens'
            onChange={(event) => setTokenAmount(event.target.value)}
            className={styles.input}
          />
          <button
            onClick={() => publicMint(tokenAmount)}
            className={styles.button}
          >
            MINT TOKRNS
          </button>
        </div>
      );
    }
    if (tokenMintOut) {
      return (
        <div className={styles.description}>
          <strong>Crypto Dev ICO is done</strong>
        </div>
      );
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      connectWallet();
    }
    getTokenToBeClaimed();
    getTotalTokensMinted();
    console.log(nftowner);
  }, [walletConnected, nftowner]);

  return (
    <div>
      <Head>
        <title>Token Mint Dapp</title>
        <meta name='description' content='Token Mint Dapp' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.container}>
        <div className={styles.main}>
          <h1 className={styles.title}>Welcome to Crypto Devs ICO!</h1>
          <div className={styles.description}>
            You can claim or mint Crypto Dev tokens here.
          </div>
          <div className={styles.description}>
            Overall <strong>{parseInt(tokensMinted.toString())}</strong>/10000
            have been minted!!!
          </div>
          {mintButtonHandler()}
        </div>
        <img
          className={styles.image}
          src='./crypto-devs.svg'
          alt='people have an NFT collection'
        />
        <footer className={styles.footer}>
          Made with&#10084; by Crypto Devs
        </footer>
      </div>
    </div>
  );
}
