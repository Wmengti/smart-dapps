import { providers } from 'ethers';
import { Fragment, useContext, useEffect, useRef } from 'react';
import Web3Modal from 'web3modal';
import WalletContext from '../../store/wallet-context';
import { truncateAddress } from '../../utils/truncateAddress';
import styles from './ConnectWallet.module.css';

const ConnectWallet = () => {
  const web3ModalRef = useRef();
  const walletCtx = useContext(WalletContext);
  if (typeof window !== 'undefined') {
    web3ModalRef.current = new Web3Modal({
      providerOptions: {},
      disableInjectedProvider: false,
      cacheProvider: true,
    });
  }

  useEffect(() => {
    if (web3ModalRef.current.cachedProvider) {
      connectHandler();
    }
  }, []);

  useEffect(() => {
    if (walletCtx.chainId.toString(10) !== 5) {
      distinctHandler();
    }
    if (walletCtx.chainId.toString(10) == 5) {
      connectHandler();
    }
  }, [walletCtx.chainId]);

  const connectHandler = () => {
    walletCtx.connectWallet(web3ModalRef.current);
  };

  const distinctHandler = () => {
    walletCtx.disconnect(web3ModalRef.current);
  };

  return (
    <Fragment>
      {!walletCtx.account ? (
        <button className={styles.btn} onClick={connectHandler}>
          Connect Wallet
        </button>
      ) : (
        <button className={styles.btn} onClick={distinctHandler}>
          {truncateAddress(walletCtx.account)}
        </button>
      )}
    </Fragment>
  );
};

export default ConnectWallet;
