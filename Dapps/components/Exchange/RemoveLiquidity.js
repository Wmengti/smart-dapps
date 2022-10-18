import { useState, useContext } from 'react';
import Image from 'next/image';
import WalletContext from '../../store/wallet-context';
import styles from './RemoveLiquidity.module.css';
import { utils } from 'ethers';

const RemoveLiquidity = (props) => {
  const [removeLP, setRemoveLP] = useState('0');
  const [removeEther, setRemoveEther] = useState('0');
  const [removeCD, setRemoveCD] = useState('0');
  const [loading, setLoading] = useState(false);
  const walletCtx = useContext(WalletContext);
  const exchangeContract = walletCtx.ExchangeContract;
  const CDTokenContract = walletCtx.CDTokenContract;
  const address = walletCtx.account;
  const reservedCD = walletCtx.reservedCD;
  const lpBalance = walletCtx.lpBalance;
  const etherBalanceContract = walletCtx.ethBalanceContract;

  const RemoveLiquidityHandler = async () => {
    try {
      const removeLPTokenWei = utils.parseEther(removeLP);
      if (removeLP > lpBalance) {
        window.alert('Please enter a correct value!');
      } else {
        setLoading(true);
        const tx = await exchangeContract.removeLiquidity(removeLPTokenWei);
        await tx.wait();
        setLoading(false);
        walletCtx.getAmounts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const calculateFromLiquidity = async (
    removerLP,
    _ethBalance,
    cdTokenReserve
  ) => {
    try {
      const _totalSupply = await exchangeContract.totalSupply();
      const _removeEther = _ethBalance
        .mul(removerLP)
        .div(utils.formatEther(_totalSupply).toString());
      const _removeCD = cdTokenReserve
        .mul(removerLP)
        .div(utils.formatEther(_totalSupply).toString());
      setRemoveEther(_removeEther);
      setRemoveCD(_removeCD);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.Liquidity}>
      <div className={styles.description}>
        You have:
        <br />
        {lpBalance} Crypto Dev LP tokens
      </div>
      <input
        type='number'
        placeholder='Amount of LP Tokens'
        className={styles.input}
        onChange={async (e) => {
          setRemoveLP(e.target.value || '0');
          await calculateFromLiquidity(
            e.target.value || '0',
            etherBalanceContract,
            reservedCD
          );
        }}
      />
      <button className={styles.btn} onClick={RemoveLiquidityHandler}>
        RemoveLiquidity
      </button>
    </div>
  );
};

export default RemoveLiquidity;
