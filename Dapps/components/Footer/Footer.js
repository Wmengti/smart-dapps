import styles from './Footer.module.css';
import Link from 'next/link';
const Footer = () => {
  return (
    <div className={styles.footer_section}>
      <div className={styles.footer_section_sub}>
        <div className={styles.footer_logo}>
          <p className={styles.footer_logo_text}>0x3c</p>
        </div>
        <div className={styles.footer_desc}>
          <p className={styles.footer_desc_text}>
            This website is a demo to show web3 dapp. Technology and components
            are Nextjs React ethersjs solidity Mongodb web3modal and so on. If
            you need a partner to realize the creation of web3, please dm me.
          </p>
        </div>
        <div className={styles.footer_line}></div>
        <div className={styles.footer_social}>
          <Link href='/'>
            <a className={styles.footer_social_link}>Doc</a>
          </Link>
          <Link href='https://twitter.com/pangmadee'>
            <a className={styles.footer_social_link}>Twitter</a>
          </Link>
          <Link href='https://github.com/Wmengti'>
            <a className={styles.footer_social_link}>Github</a>
          </Link>
          <Link href='https://dune.com/kabu'>
            <a className={styles.footer_social_link}>Dune</a>
          </Link>
          <Link href='https://mirror.xyz/gamfi.eth'>
            <a className={styles.footer_social_link}>Mirror</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
