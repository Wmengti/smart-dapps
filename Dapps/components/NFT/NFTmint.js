import { Fragment, useContext, useEffect, useState, useRef } from 'react';
import { utils } from 'ethers';
import WalletContext from '../../store/wallet-context';
import styles from '../NFT/NFTmint.module.css';

const NFTmint = () => {
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [loading, setloading] = useState(false);
  const [saleout, setSaleout] = useState(false);
  const [tokenId, setTokenId] = useState(0);
  const [isPbmint, setIsPbmint] = useState(false);
  const [time, setTime] = useState(null);
  const [seconds, setSeconds] = useState(null);
  const [minute, setMinute] = useState(null);
  const [wlminted, setWlminted] = useState(false);
  const timeRef = useRef(); //设置延时器

  const WalletCtx = useContext(WalletContext);
  const cryptodevsNft = WalletCtx.CDContract;
  const whitelistContract = WalletCtx.WLContract;
  // console.log('1', cryptodevsNft);
  // console.log('2', whitelistContract);
  // console.log('3', presaleStarted);
  // console.log('4', presaleEnded);
  // console.log('5', time);
  // console.log('6', joinedWhitelist);

  const checkIfwlminted = async () => {
    try {
      const _wlminted = await cryptodevsNft.wlminted();
      setWlminted(_wlminted);
    } catch (e) {
      console.error(e);
    }
  };

  const checkIfpresaleStart = async () => {
    try {
      const _presaleStarted = await cryptodevsNft.presaleStarted();
      setPresaleStarted(_presaleStarted);
    } catch (e) {
      console.error(e);
    }
  };

  const checkIfpresaleEnd = async () => {
    try {
      const _presaleEndedTime = await cryptodevsNft.presaleEnded();
      const _presaleEnded = _presaleEndedTime.lt(Math.floor(Date.now() / 1000));
      setPresaleEnded(_presaleEnded);
      const _time = _presaleEndedTime - Math.floor(Date.now() / 1000);
      setTime(_time);
    } catch (e) {
      console.error(e);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        WalletCtx.account
      );

      setJoinedWhitelist(_joinedWhitelist);
    } catch (e) {
      console.error(e);
    }
  };

  const checkIfsaleout = async () => {
    try {
      const currentTokenId = await cryptodevsNft.getTokenIds();
      setTokenId(currentTokenId.toString());
      const maxTokenIds = await cryptodevsNft.maxTokenIds();
      const isSaleout =
        currentTokenId.toString() === maxTokenIds.toString() ? true : false;
      setSaleout(isSaleout);
    } catch (e) {
      console.error(e);
    }
  };

  const presaleMint = async () => {
    try {
      if (wlminted) {
        window.alert('You successfully minted a Crypto Dev!');
      }
      if (!joinedWhitelist) {
        window.alert('You are not whitelist!');
      }
      const tx = await cryptodevsNft.presaleMint();
      setloading(true);
      await tx.wait(1);
      setloading(false);
      await checkIfsaleout();
      window.alert('You successfully minted a Crypto Dev!');
    } catch (e) {
      console.error(e);
    }
  };
  const publicMint = async () => {
    try {
      if (!presaleEnded) {
        window.alert('Presale has not ended yet');
      } else {
        const tx = await cryptodevsNft.Mint({
          value: utils.parseEther('0.01'),
        });
        setIsPbmint(true);
        setloading(true);

        await tx.wait(1);
        setIsPbmint(false);
        setloading(false);
        await checkIfsaleout();
        window.alert('You successfully minted a Crypto Dev!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  //倒计时
  useEffect(() => {
    //如果设置倒计时且倒计时不为0
    if (time && time > 0)
      timeRef.current = setTimeout(() => {
        setTime((time) => time - 1);
        let second = Math.floor(time % 60);
        second = second < 10 ? `0${second}` : second;
        setSeconds(second);
        let minute = Math.floor(time / 60);
        minute = minute < 10 ? `0${minute}` : minute;
        setMinute(minute);
      }, 1000);
    //清楚延时器
    return () => {
      clearTimeout(timeRef.current);
    };
  }, [time]);

  useEffect(() => {
    checkIfwlminted();
    checkIfAddressInWhitelist();
    checkIfpresaleStart();
    checkIfpresaleEnd();
    checkIfsaleout();
  }, [WalletCtx.account]);

  // useEffect(() => {
  //   if (WalletCtx.chainId.toString(10) !== 4) {
  //     setJoinedWhitelist(false);
  //   }
  // }, [WalletCtx.chainId]);

  const renderCounterDown = () => {
    if (time > 0) {
      return (
        <div>
          <ul className={styles.times}>
            <li className={styles.times1}>{minute}</li>
            <li className={styles.times2}>MINUTES</li>
            <li className={styles.times3}>{seconds}</li>
            <li className={styles.times4}>SECONDS</li>
          </ul>
        </div>
      );
    } else {
      return (
        <div>
          <ul className={styles.times}>
            <li className={styles.times1}>00</li>
            <li className={styles.times2}>MINUTES</li>
            <li className={styles.times3}>00</li>
            <li className={styles.times4}>SECONDS</li>
          </ul>
        </div>
      );
    }
  };

  const renderWhitelist = () => {
    if (loading && joinedWhitelist) {
      return <button className={styles.btn}>Loading...</button>;
    } else {
      return (
        <button className={styles.btn} onClick={presaleMint}>
          claim
        </button>
      );
    }
  };

  const renderPublicMint = () => {
    if (loading && isPbmint) {
      return <button className={styles.btn}>Loading...</button>;
    } else {
      return (
        <button className={styles.btn} onClick={publicMint}>
          mint
        </button>
      );
    }
  };

  return (
    <div id='NFTs' className={styles.section_NFTs}>
      <section className={styles.mint}>
        <div className={styles.ountdown}>
          <div>
            <h2 className={styles.h2}>MINTED</h2>
            <div>
              <ul className={styles.tokenId}>
                <li>{tokenId}</li>
                <li>/</li>
                <li>20</li>
              </ul>
            </div>
          </div>
          <div>{renderCounterDown()}</div>
        </div>
        <div className={styles.card}>
          <h2>WhileList Claim</h2>
          <p>As the whitelist user, you can free claim one NFT.</p>
          <div className={styles.card_btn}>{renderWhitelist()}</div>
        </div>
        <div className={styles.card}>
          <h2>Public Mint</h2>
          <p>
            Every NFT is value 0.01 ETH. No limit number just feel free to mint.
          </p>
          <div className={styles.card_btn}>{renderPublicMint()}</div>
        </div>
      </section>
    </div>
  );
};

export default NFTmint;
