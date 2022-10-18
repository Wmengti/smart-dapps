import { useState, useContext, useRef } from 'react';
import Image from 'next/image';

import WalletContext from '../../store/wallet-context';
import styles from './AddLiquidity.module.css';
import { utils } from 'ethers';

const AddLiquidity = (props) => {
  const [addEther, setAddEther] = useState('0');
  const [addCD, setAddCD] = useState('0');
  const [loading, setLoading] = useState(false);
  const walletCtx = useContext(WalletContext);
  const exchangeContract = walletCtx.ExchangeContract;
  const CDTokenContract = walletCtx.CDTokenContract;
  const address = walletCtx.account;
  const reservedCD = walletCtx.reservedCD;
  const etherBalanceContract = walletCtx.ethBalanceContract;
  const ethBalance = walletCtx.ethBalance;
  const cdBalance = walletCtx.cdBalance;
  const addEtherRef = useRef();
  const addCDRef = useRef();
  console.log('reservedCD', parseInt(reservedCD) == '0');
  console.log('addEther', addEther);
  console.log('addCD', addCD);

  const addLiquidityHandler = async () => {
    try {
      const addEtherWei = utils.parseEther(addEther.toString());
      const addCDWei = utils.parseEther(addCD.toString());
      if (addEther === '0.0' || addCD === '0.0') {
        window.alert('please enter correct value');
      }
      if (addEther !== '0' && addCD !== '0') {
        setLoading(true);
        await addLiquidity(addCDWei, addEtherWei);
        setLoading(false);
        // setAddEther('0');
        // setAddCD('0');
        walletCtx.getAmounts();
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      // setAddEther('0');
      // setAddCD('0');
    }
  };

  const addLiquidity = async (addCDAmountWei, addEtherAmountWei) => {
    try {
      let tx = await CDTokenContract.approve(
        walletCtx.ExchangeAddress,
        addCDAmountWei,
        { from: walletCtx.account }
      );
      await tx.wait(1);
      console.log('approve');
      tx = await exchangeContract.addLiquidity(addCDAmountWei, {
        value: addEtherAmountWei,
      });
      await tx.wait(1);
    } catch (e) {
      console.error(e);
    }
  };

  const calculateToLiquidity = async (
    _addEther = '0',
    etherBalanceContract,
    cdTokenReserve
  ) => {
    if (etherBalanceContract !== '0') {
      const _ethBalanceContract = utils.parseEther(etherBalanceContract);
      const _cdTokenReserve = utils.parseEther(cdTokenReserve);

      const _addEtherAmountWei = utils.parseEther(_addEther);
      const cdTokenAmount = _addEtherAmountWei
        .mul(_cdTokenReserve)
        .div(_ethBalanceContract);
      return cdTokenAmount;
    }

    return '0';
  };

  return (
    <div className={styles.Liquidity}>
      {parseInt(reservedCD) == '0' ? (
        <div className={styles.input_info}>
          <div className={styles.swap_tab}>
            <label className={styles.select_tab}>ETH</label>
            <p className={styles.balance}>Balance:{ethBalance}</p>
          </div>
          <input
            type='number'
            ref={addEtherRef}
            placeholder='Amount of Ether'
            onChange={(e) => setAddEther(e.target.value || '0')}
            className={styles.input}
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
              d='M12 4.5v15m7.5-7.5h-15'
            />
          </svg>

          <div className={styles.swap_tab}>
            <label className={styles.select_tab}>CD</label>
            <p className={styles.balance}>Balance:{cdBalance}</p>
          </div>
          <input
            type='number'
            ref={addCDRef}
            placeholder='Amount of CD'
            onChange={(e) => setAddCD(e.target.value || '0')}
            className={styles.input}
          />
          <button className={styles.btn} onClick={addLiquidityHandler}>
            addLiquidity
          </button>
        </div>
      ) : (
        <div className={styles.input_info}>
          <div className={styles.swap_tab}>
            <label className={styles.select_tab}>ETH</label>
            <p className={styles.balance}>Balance:{ethBalance}</p>
          </div>
          <input
            type='number'
            placeholder='Amount of Ether'
            onChange={async (e) => {
              setAddEther(e.target.value || '0');
              const _cdTokenAmount = await calculateToLiquidity(
                e.target.value || '0',
                etherBalanceContract,
                reservedCD
              );
              setAddCD(utils.formatEther(_cdTokenAmount).toString());
            }}
            className={styles.input}
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
              d='M12 4.5v15m7.5-7.5h-15'
            />
          </svg>
          <div className={styles.swap_tab}>
            <label className={styles.select_tab}>CD</label>
            <p className={styles.balance}>Balance:{cdBalance}</p>
          </div>
          <input
            type='number'
            placeholder='Amount of CD'
            value={addCD || '0'}
            className={styles.input}
          />
          <button className={styles.btn} onClick={addLiquidityHandler}>
            addLiquidity
          </button>
        </div>
      )}
    </div>
  );
};

export default AddLiquidity;
