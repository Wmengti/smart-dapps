import { useState, useContext, useRef } from 'react';
import Image from 'next/image';
import WalletContext from '../../store/wallet-context';
import styles from './Swap.module.css';
import { utils } from 'ethers';

const Swap = (props) => {
  const [inputAmount, setInputAmount] = useState('0');
  const [outputAmount, setOutputAmount] = useState('0');
  const [loading, setLoading] = useState(false);
  const [selectToken, setSelectToken] = useState('ETH');
  const walletCtx = useContext(WalletContext);
  const exchangeContract = walletCtx.ExchangeContract;
  const CDTokenContract = walletCtx.CDTokenContract;
  const address = walletCtx.account;
  const reservedCD = walletCtx.reservedCD;
  const etherBalanceContract = walletCtx.ethBalanceContract;
  const ethBalance = walletCtx.ethBalance;
  const cdBalance = walletCtx.cdBalance;
  const inputEthRef = useRef();
  const inputCDRef = useRef();

  console.log('cdBalance', typeof cdBalance);
  console.log('inputAmount', inputAmount);
  console.log('outputAmount', outputAmount);

  const swapHander = (e) => {
    const value = e.target.value;
    if (value === 'ETH') {
      setSelectToken('ETH');
    } else {
      setSelectToken('CD');
    }
  };
  const getAmountOfToken = async (
    inputWei,
    _selectToken,
    _ethBalance,
    _reservedCD
  ) => {
    let _amount;

    if (_selectToken === 'ETH') {
      _amount = await exchangeContract.getAmountOfTokens(
        inputWei,
        _ethBalance,
        _reservedCD
      );
    } else {
      _amount = await exchangeContract.getAmountOfTokens(
        inputWei,
        _reservedCD,
        _ethBalance
      );
    }
    return _amount;
  };
  const getAmounbySwapHandler = async (_swapAmount) => {
    try {
      console.log('enter');
      const _swapAmountWei = utils.parseEther(_swapAmount.toString());
      const _ethBalance = utils.parseEther(ethBalance);
      const _reservedCD = utils.parseEther(reservedCD);
      console.log(_swapAmountWei);
      console.log(_ethBalance);
      console.log(_reservedCD);

      if (_swapAmount !== '0') {
        const amountOfTokens = await getAmountOfToken(
          _swapAmountWei,
          selectToken,
          _ethBalance,
          _reservedCD
        );
        console.log('amountOfTokens', amountOfTokens);
        setOutputAmount(utils.formatEther(amountOfTokens).toString());
      } else {
        setOutputAmount('0');
      }
    } catch (e) {
      console.error(e);
    }
  };
  const swapTokens = async (swapAmountWei, outputAmount, _selectToken) => {
    let tx;
    const outputWei = utils.parseEther(outputAmount.toString());
    if (_selectToken === 'ETH') {
      tx = await exchangeContract.ethToCryptoDevToken(outputWei, {
        value: swapAmountWei,
      });
    } else {
      tx = await CDTokenContract.approve(
        walletCtx.ExchangeAddress,
        swapAmountWei.toString()
      );
      await tx.wait();
      tx = await exchangeContract.cryptoDevTokenToEth(swapAmountWei, outputWei);
    }
    await tx.wait();
  };

  const swapTokensHandler = async () => {
    try {
      const swapAmountWei = utils.parseEther(inputAmount);
      if (inputAmount !== '0') {
        setLoading(true);
        await swapTokens(swapAmountWei, outputAmount, selectToken);
        setLoading(false);
        walletCtx.getAmounts();
        setInputAmount('');
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setInputAmount('');
    }
  };

  return (
    <div>
      {selectToken === 'ETH' ? (
        <div className={styles.swap}>
          <div className={styles.change}>
            <div className={styles.swap_tab}>
              <select
                className={styles.select_tab}
                id='select'
                onChange={swapHander}
                required
              >
                <option value='ETH'>ETH</option>
                <option value='CD'>CD</option>
              </select>
              <p className={styles.balance}>Balance:{ethBalance}</p>
            </div>
            <div className={styles.change_in}>
              <input
                type='number'
                ref={inputEthRef}
                placeholder='Amount of Ether'
                className={styles.input}
                onChange={async (e) => {
                  setInputAmount(e.target.value || '');
                  await getAmounbySwapHandler(inputEthRef.current.value);
                }}
              />
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                className={styles.to}
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75'
                />
              </svg>
              <div className={styles.swap_tab}>
                <label className={styles.select_tab}>CD</label>
                <p className={styles.balance}>Balance:{cdBalance}</p>
              </div>
              <input
                type='number'
                className={styles.input}
                placeholder='Amount'
                value={outputAmount}
                readOnly
              />
            </div>
          </div>
          <button className={styles.btn} onClick={swapTokensHandler}>
            Swap
          </button>
        </div>
      ) : (
        <div className={styles.swap}>
          <div className={styles.change}>
            <div className={styles.swap_tab}>
              <select
                className={styles.select_tab}
                id='select'
                onChange={swapHander}
                required
              >
                <option value='ETH'>ETH</option>
                <option value='CD'>CD</option>
              </select>
              <p className={styles.balance}>Balance:{cdBalance}</p>
            </div>
            <div className={styles.change_in}>
              <input
                type='number'
                ref={inputCDRef}
                placeholder='Amount of CD'
                className={styles.input}
                onChange={async (e) => {
                  setInputAmount(e.target.value || '');
                  await getAmounbySwapHandler(inputCDRef.current.value);
                }}
              />
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                className={styles.to}
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75'
                />
              </svg>
              <div className={styles.swap_tab}>
                <label className={styles.select_tab}>ETH</label>
                <p className={styles.balance}>Balance:{ethBalance}</p>
              </div>
              <input
                type='number'
                className={styles.input}
                placeholder='Amount'
                value={outputAmount}
                readOnly
              />
            </div>
          </div>
          <button className={styles.btn} onClick={swapTokensHandler}>
            Swap
          </button>
        </div>
      )}
    </div>
  );
};

export default Swap;
