import Link from 'next/link';
import styles from './Navigation.module.css';

import ConnectWallet from './ConnectWallet';
import WhiteList from '../Hero/WhiteList';

const Navigation = (props) => {
  return (
    <div className={styles.header_back}>
      <header className={styles.header}>
        <a href='/#'>
          <img
            className={styles.logo}
            alt='Crypto Dev logo'
            src='/ethereumlogo.png'
          />
        </a>
        <nav className={styles.main_nav}>
          <ul className={styles.main_nav_list}>
            <li>
              <a className={styles.main_nav_link} href='/#whitelist'>
                WhiteList
              </a>
            </li>
            <li>
              <a className={styles.main_nav_link} href='/#NFTs'>
                NFTs
              </a>
            </li>
            <li>
              <a className={styles.main_nav_link} href='/#Tokens'>
                Tokens
              </a>
            </li>
            <li>
              <a className={styles.main_nav_link} href='/#DAO'>
                DAO
              </a>
            </li>
          </ul>
          <ConnectWallet />
        </nav>
      </header>
    </div>
  );
};

export default Navigation;
