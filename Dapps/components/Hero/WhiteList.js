import { Fragment, useContext, useEffect, useState, useRef } from 'react';

import WalletContext from '../../store/wallet-context';
import styles from '../Hero/Whitelist.module.css';

const WhiteList = () => {
  const [numberOfWL, setNumberOfWL] = useState(0);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);

  const [loading, setLoading] = useState(false);
  const WalletCtx = useContext(WalletContext);
  const WLContract = WalletCtx.WLContract;

  // console.log('wl', joinedWhitelist);
  // console.log('1', WLContract);

  const getNumberOfWhitelisted = async () => {
    try {
      const _numberOfWhitelisted = await WLContract.numAddressesWhitelisted();
      setNumberOfWL(_numberOfWhitelisted);
    } catch (e) {
      console.error(e);
    }
  };
  const addAddressToWhitelist = async () => {
    try {
      const tx = await WLContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (e) {
      console.error(e);
    }
  };
  const checkIfAddressInWhitelist = async () => {
    try {
      const _joinedWhitelist = await WLContract.whitelistedAddresses(
        WalletCtx.account
      );

      setJoinedWhitelist(_joinedWhitelist);
    } catch (e) {
      console.error(e);
    }
  };
  // const switchNetworkHander = () => {
  //   WLContract.switchNetwork(4);
  // };

  const renderButton = () => {
    if (joinedWhitelist) {
      return <button className={styles.btn}>Joined !</button>;
    }
    if (loading) {
      return <button className={styles.btn}>Loading...</button>;
    } else {
      return (
        <div>
          <button
            onClick={addAddressToWhitelist}
            className={`${styles.btn} ${styles.button1}`}
          >
            Whitelist{' '}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              className={styles.icon}
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M8.25 4.5l7.5 7.5-7.5 7.5'
              />
            </svg>
          </button>
        </div>
      );
    }
  };

  useEffect(() => {
    if (typeof WalletCtx.account === 'undefined') {
      setJoinedWhitelist(false);
    }
    getNumberOfWhitelisted();
    checkIfAddressInWhitelist();
  }, [WalletCtx.account]);

  useEffect(() => {
    if (WalletCtx.chainId.toString(10) !== 5) {
      setJoinedWhitelist(false);
    }
  }, [WalletCtx.chainId]);
  return (
    <div id='whitelist' className={styles.section_hero}>
      <section className={styles.hero}>
        <h1 className={styles.h1}>Welcome to our Crypto Devs Community</h1>

        <p className={styles.description}>
          Have fun for you crypto journey. We are DAO for investing NFT or other
          crypto things. Above all, you should have our whitelist to get access
          to buy NFT which is the enter ticket of the DAO. it may get further
          more and more airdrops.
        </p>
        <p className={styles.description}>
          {numberOfWL} have already joined the Whitelist.{' '}
        </p>
        <p className={styles.desc_mobile}>
          {numberOfWL} have already joined the Whitelist.{' '}
        </p>

        {renderButton()}
      </section>
    </div>
  );
};

export default WhiteList;
