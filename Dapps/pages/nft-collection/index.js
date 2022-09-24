import Head from 'next/head';
import styles from '../../styles/NFT.module.css';

import Web3Modal from 'web3modal';
import { providers, Contract, utils } from 'ethers';
import { useState, useRef, useEffect } from 'react';

import cryptodevsABI from '../../constants/CDabi.json';
import cryptodevsAddress from '../../constants/CDaddress.json';
import whitelistABI from '../../constants/WLabi.json';
import whitelistAddress from '../../constants/WLaddress.json';

export default function NFTcollection() {
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [presaleEnted, setPresaleEnded] = useState(false);
  const [loading, setloading] = useState(false);
  const [saleout, setSaleout] = useState(false);
  const [tokenId, setTokenId] = useState(0);

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
  const checkIfpresaleStart = async () => {
    try {
      const provider = await getProviderOrSigner();
      const cryptodevs = new Contract(
        cryptodevsAddress,
        cryptodevsABI,
        provider
      );
      const _isStarted = await cryptodevs.presaleStarted();
      setPresaleStarted(_isStarted);
      return _isStarted;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const checkIfpresaleEnd = async () => {
    try {
      const provider = await getProviderOrSigner();
      const cryptodevs = new Contract(
        cryptodevsAddress,
        cryptodevsABI,
        provider
      );
      const _presaleEndedTime = await cryptodevs.presaleEnded();
      const _hasEnded = _presaleEndedTime.lt(Math.floor(Date.now() / 1000));
      setPresaleEnded(_hasEnded);
      return _hasEnded;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        whitelistAddress,
        whitelistABI,
        signer
      );
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );

      setJoinedWhitelist(_joinedWhitelist);
      console.log(_joinedWhitelist);
    } catch (e) {
      console.error(e);
    }
  };

  const checkIfsaleout = async () => {
    try {
      const provider = await getProviderOrSigner();
      const cryptodevs = new Contract(
        cryptodevsAddress,
        cryptodevsABI,
        provider
      );
      const currentTokenId = await cryptodevs.getTokenIds();
      setTokenId(currentTokenId.toString());
      const maxTokenIds = await cryptodevs.maxTokenIds();
      const isStarted =
        currentTokenId.toString() === maxTokenIds.toString() ? true : false;
      setSaleout(isStarted);
    } catch (e) {
      console.error(e);
    }
  };

  const presaleMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const cryptodevs = new Contract(cryptodevsAddress, cryptodevsABI, signer);
      const tx = await cryptodevs.presaleMint({
        value: utils.parseEther('0.01'),
      });
      setloading(true);
      await tx.wait(1);
      setloading(false);
      window.alert('You successfully minted a Crypto Dev!');
    } catch (e) {
      console.error(e);
    }
  };
  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const cryptodevs = new Contract(cryptodevsAddress, cryptodevsABI, signer);
      const tx = await cryptodevs.Mint({
        value: utils.parseEther('0.01'),
      });
      setloading(true);
      await tx.wait(1);
      setloading(false);
      window.alert('You successfully minted a Crypto Dev!');
    } catch (e) {
      console.error(e);
    }
  };

  const renderButton = () => {
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
    if (!presaleStarted) {
      return (
        <div className={styles.description}>
          <strong>Waiting for presale mint!</strong>
        </div>
      );
    }

    if (presaleStarted && !presaleEnted) {
      if (joinedWhitelist) {
        return (
          <button onClick={presaleMint} className={styles.button}>
            PRESALE MINT
          </button>
        );
      } else {
        return (
          <div className={styles.description}>
            <strong>Waiting for presale mint!</strong>
          </div>
        );
      }
    }
    if (presaleEnted) {
      if (!saleout) {
        return (
          <button onClick={publicMint} className={styles.button}>
            PUBLIC MINT
          </button>
        );
      } else {
        return (
          <div className={styles.description}>
            <strong>Mint is done!</strong>
          </div>
        );
      }
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      connectWallet();
    }

    const _presaleStarted = checkIfpresaleStart();
    if (_presaleStarted) {
      checkIfpresaleEnd();
    }
    checkIfAddressInWhitelist();
    checkIfsaleout();

    const presaleEndedInterval = setInterval(async function () {
      const _presaleStarted = await checkIfpresaleStart();
      if (_presaleStarted) {
        const _presaleEnded = await checkIfpresaleEnd();
        if (_presaleEnded) {
          clearInterval(presaleEndedInterval);
        }
      }
    }, 5 * 1000);

    setInterval(async function () {
      await checkIfsaleout();
    }, 5 * 1000);
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>NFT Mint Dapp</title>
        <meta name='description' content='NFT Mint Dapp' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.container}>
        <div className={styles.main}>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            It&apos;s an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            <strong>{tokenId}</strong>/20 have been minted.
          </div>
          {renderButton()}
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
