import { Fragment } from 'react';
import Exchange from '../Exchange/Exchange';
import TokenMint from './TokenMint';
import styles from './Tokens.module.css';
import LiquidityTable from '../Exchange/LiquidityTable';

const Tokens = (props) => {
  return (
    <div id='Tokens' className={styles.section_tokens}>
      <div className={styles.tokens}>
        <TokenMint />
        <LiquidityTable data={props.data} />
        <Exchange />
      </div>
    </div>
  );
};

export default Tokens;
