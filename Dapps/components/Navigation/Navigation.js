import Link from 'next/link';
import styles from './Navigation.module.css';

import ConnectWallet from './ConnectWallet';
import WhiteList from '../Hero/WhiteList';

const Navigation = (props) => {
  return (
    <div className={styles.header_back}>
      <header className={styles.header}>
        <Link href='/#'>
          <a>
            <img
              className={styles.logo}
              alt='Crypto Dev logo'
              src='/ethereumlogo.png'
            />
          </a>
        </Link>
        <nav className={styles.main_nav}>
          <ul className={styles.main_nav_list}>
            <li>
              <Link href='/#whitelist'>
                <a className={styles.main_nav_link}>WhiteList</a>
              </Link>
            </li>
            <li>
              <Link className={styles.main_nav_link} href='/#NFTs'>
                <a className={styles.main_nav_link}>NFTs</a>
              </Link>
            </li>
            <li>
              <Link className={styles.main_nav_link} href='/#Tokens'>
                <a className={styles.main_nav_link}>Tokens</a>
              </Link>
            </li>
            <li>
              <Link className={styles.main_nav_link} href='/#DAO'>
                <a className={styles.main_nav_link}>DAO</a>
              </Link>
            </li>
          </ul>
          <ConnectWallet />
        </nav>
      </header>
    </div>
  );
};

export default Navigation;
