import { useState, useContext, useEffect, useRef } from 'react';
import { utils } from 'ethers';
import Image from 'next/image';
import styles from './Exchange.module.css';
import WalletContext from '../../store/wallet-context';
import Swap from './Swap';
import AddLiquidity from './AddLiquidity';
import RemoveLiquidity from './RemoveLiquidity';

const Exchange = () => {
  const [selectTab, setSelectTab] = useState(true);
  const [selectAdd, setSelectAdd] = useState('1');
  const walletCtx = useContext(WalletContext);
  const reservedCD = walletCtx.reservedCD;
  const etherBalanceContract = walletCtx.ethBalanceContract;
  const ethBalance = walletCtx.ethBalance;
  const cdBalance = walletCtx.cdBalance;
  const lpBalance = walletCtx.lpBalance;
  console.log('selectAdd', selectAdd);

  const liquiditySelectHandler = () => {
    if (selectAdd === '1') {
      return (
        <div className={styles.main_liquidity}>
          <div className={styles.description}>
            You have:
            <br />
            {cdBalance} Crypto Dev Tokens
            <br />
            {ethBalance} Ether
            <br />
            {lpBalance} Crypto Dev LP tokens
          </div>
          <button onClick={() => setSelectAdd('2')}>Add</button>
          <button onClick={() => setSelectAdd('3')}>Remove</button>
        </div>
      );
    } else if (selectAdd === '2') {
      return (
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            onClick={() => setSelectAdd('1')}
            className={styles.icon}
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <AddLiquidity />
        </div>
      );
    } else {
      return (
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            onClick={() => setSelectAdd('1')}
            className={styles.icon}
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <RemoveLiquidity />
        </div>
      );
    }
  };

  useEffect(() => {
    liquiditySelectHandler();
  }, [selectAdd]);

  useEffect(() => {
    walletCtx.getAmounts();
  }, [walletCtx.account]);

  return (
    <div className={styles.section_exchange}>
      <div className={styles.selected}>
        <div className={styles.tab1}>
          <button
            style={{ backgroundColor: selectTab ? '#fff' : '#c6ded0' }}
            className={styles.tab_btn}
            onClick={() => {
              setSelectTab(true);
              setSelectAdd('1');
            }}
          >
            Swap
          </button>
        </div>

        <div className={styles.tab2}>
          <button
            style={{ backgroundColor: selectTab ? '#c6ded0' : '#fff' }}
            className={styles.tab_btn}
            onClick={() => setSelectTab(false)}
          >
            Liquidity
          </button>
        </div>
      </div>
      <div className={styles.exchange}>
        {selectTab ? <Swap /> : liquiditySelectHandler()}
      </div>
    </div>
  );
};
export default Exchange;
