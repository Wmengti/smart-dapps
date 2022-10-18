import styles from './TokenMint.module.css';
import WalletContext from '../../store/wallet-context';
import { utils } from 'ethers';
import { useState, useRef, useEffect, useContext } from 'react';

const TokenMint = () => {
  const [loading, setLoading] = useState(false);
  const [nftowner, setNftOwner] = useState(false);
  const [tokenToBeClaimed, setTokenToBeClaimed] = useState(0);
  const [tokenMintOut, setTokenMintOut] = useState(false);
  const [tokensMinted, setTokenMinted] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [isPbmint, setIsPbmint] = useState(false);
  const WalletCtx = useContext(WalletContext);
  const cryptodevsNft = WalletCtx.CDContract;
  const cryptodevsToken = WalletCtx.CDTokenContract;
  console.log('nftowner', nftowner);
  console.log('tokenToBeClaimed', tokenToBeClaimed);
  console.log('tokensMinted', tokensMinted);
  console.log('tokenMintOut', tokenMintOut);

  const getTokenToBeClaimed = async () => {
    try {
      const _balance = await cryptodevsNft.balanceOf(WalletCtx.account);
      console.log(_balance.toString());
      if (_balance.toString() === '0') {
        setNftOwner(false);
        setTokenToBeClaimed(0);
      } else {
        setNftOwner(true);
        let count = 0;
        for (let i = 0; i < _balance; i++) {
          const nftIndex = await cryptodevsNft.tokenOfOwnerByIndex(
            WalletCtx.account,
            i
          );
          const _isClaimed = await cryptodevsToken.tokenIdsClaimed(nftIndex);
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
      const totalSupply = await cryptodevsToken.totalSupply();
      const _tokensMinted = utils.formatEther(totalSupply);
      setTokenMinted(_tokensMinted);
      const _mintout = _tokensMinted === 10000 ? true : false;
      setTokenMintOut(_mintout);
    } catch (e) {
      console.error(e);
    }
  };

  const nftOwnerClaim = async () => {
    console.log('claim');
    try {
      if (!nftowner) {
        window.alert('You are not NFT owner!');
      }
      if (tokenMintOut) {
        window.alert('Tokens have been saleout!');
      }
      if (nftowner && !tokenMintOut) {
        const tx = await cryptodevsToken.claim();
        setLoading(true);
        await tx.wait(1);
        setLoading(false);
        window.alert('You successfully Claim Crypto Dev Tokens!');
        await getTokenToBeClaimed();
        await getTotalTokensMinted();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const publicMint = async (amount) => {
    try {
      if (tokenMintOut) {
        window.alert('Tokens have been saleout!');
      } else {
        const totalValue = 0.001 * amount;
        const tx = await cryptodevsToken.mint(amount, {
          value: utils.parseEther(totalValue.toString()),
        });
        setIsPbmint(true);
        setLoading(true);
        await tx.wait(1);
        setIsPbmint(false);
        setLoading(false);
        window.alert('You successfully Mint Crypto Dev Tokens!');
        await getTotalTokensMinted();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const wlClaimHandler = () => {
    if (loading && nftowner && !isPbmint) {
      return <button className={styles.button}>Loading</button>;
    }

    if (tokenToBeClaimed > 0) {
      return (
        <button onClick={nftOwnerClaim} className={styles.button}>
          claim
        </button>
      );
    } else {
      return <button className={styles.button}>claimed</button>;
    }
  };

  const pbMintHandler = () => {
    if (loading && isPbmint) {
      return <button className={styles.button}>Loading</button>;
    } else {
      return (
        <button
          onClick={() => publicMint(tokenAmount)}
          className={styles.button}
        >
          mint
        </button>
      );
    }
  };

  useEffect(() => {
    getTokenToBeClaimed();
    getTotalTokensMinted();
  }, [WalletCtx.account]);

  return (
    <div>
      <nav className={styles.mint}>
        <div className={styles.wlmint}>
          <h2 className={styles.h2}>NFT Owner Claim</h2>
          {wlClaimHandler()}
        </div>
        <div className={styles.pbmint}>
          <h2 className={styles.h2}>Public Mint Tokens</h2>
          <input
            type='number'
            placeholder='Amounts'
            onChange={(event) => setTokenAmount(event.target.value)}
            className={styles.input}
            required
          />
          {pbMintHandler()}
        </div>
      </nav>
    </div>
  );
};

export default TokenMint;
