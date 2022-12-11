import Head from 'next/head';
import Link from 'next/link';
import WhiteList from '../components/Hero/WhiteList';
import NFTmint from '../components/NFT/NFTmint';
import Tokens from '../components/Tokens/Tokens';
import DAO from '../components/DAO/DAO';
import Footer from '../components/Footer/Footer';
import { useEffect, useContext, useState, useRef } from 'react';
import WalletContext from '../store/wallet-context';
import { MongoClient } from 'mongodb';
import moment from 'moment';

export default function Home(props) {
  const lpBalanceContractRef = useRef();

  const walletCtx = useContext(WalletContext);
  lpBalanceContractRef.current = walletCtx.lpBalanceContract;
  const liquidityData = {
    time: new Date(),
    liquidity: lpBalanceContractRef.current,
  };
  const uploadLiquidity = async () => {
    const response = await fetch('/api/liquidity', {
      method: 'POST',
      body: JSON.stringify(liquidityData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
  };
  console.log('lp', props.data);

  useEffect(() => {
    const interval = setInterval(async () => {
      await uploadLiquidity();
      console.log(new Date());
    }, 1000 * 3600);

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <Head>
        <title>Web3.0 Dapps</title>
        <meta name='description' content='WhiteList-Dapp' />
        {/* <meta name='twitter:card' content='summary' /> */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@pangmadee' />
        <meta name='twitter:title' content='0x3c test web3' />
        <meta name='twitter:description' content='Twitter share card' />
        <meta
          name='twitter:image'
          content='https://farm6.staticflickr.com/5510/14338202952_93595258ff_z.jpg'
        />
        <link rel='icon' href='/entericon.png' />
      </Head>
      <main>
        <WhiteList />
        <NFTmint />
        <Tokens data={props.data} />
        <DAO />
        <Footer />
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const client = await MongoClient.connect(
    'mongodb+srv://0x3c:IwMB11GkkHZ4LKyV@cluster0.gnlmiqz.mongodb.net/liquidity?retryWrites=true&w=majority'
  );

  const db = client.db();

  const liquidityCollcection = db.collection('liquidityChange');
  const liquidity = await liquidityCollcection
    .find({
      time: {
        // $gte: new Date(Date.now() - 24 * 2 * 60 * 60 * 1000).toISOString(),
        // $lt: Date(),
        $gte: '2022-10-02T00:00:00Z',
        $lt: '2022-10-03T00:00:00Z',
      },
    })
    .toArray();

  client.close();

  return {
    props: {
      data: liquidity.map((lp, index) => ({
        date: moment(lp.time).format('h:mma'),
        x: index,
        y: lp.liquidity,
      })),
    },
    revalidate: 1,
  };
}
