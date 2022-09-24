import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
export default function Home() {
  return (
    <div>
      <Head>
        <title>Web3.0 Dapps</title>
        <meta name='description' content='WhiteList-Dapp' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <Link href='/'>Web3.0 Dapps</Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link href='/whitelist'>WhiteList</Link>
            </li>
            <li>
              <Link href='/nft-collection'>NFTs</Link>
            </li>
            <li>
              <Link href='/tokens'>Tokens</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
