import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';
import styles from '../../styles/dao_vote.module.css';
import DAOvoteList from '../../components/DAO/DAOvoteList';
import { id } from 'ethers/lib/utils';
import { useRouter } from 'next/router';
import { TwitterShareButton } from 'react-share';

function DAOProposalVote(props) {
  const router = useRouter();
  const href = router.asPath;
  console.log('href', href);
  return (
    <div className={styles.dao_vote}>
      <Head>
        <title>Web3.0 Dapps</title>
        <meta name='description' content='WhiteList-Dapp' />
        <meta name='twitter:card' content='summary' />
        {/* <meta name='twitter:card' content='summary_large_image' /> */}
        <meta name='twitter:site' content='@pangmadee' />
        <meta name='twitter:title' content='0x3c test sub page web3' />
        <meta name='twitter:description' content='Twitter share card subpage' />
        {/* <meta name='twitter:url' content='https://0x3c.xyz/dao_vote' />
        <meta property='og:url' content='https://0x3c.xyz/dao_vote' /> */}
        <meta name='twitter:type' content='article' />
        <meta
          name='twitter:image'
          content='https://farm6.staticflickr.com/5510/14338202952_93595258ff_z.jpg'
        />
        <link rel='icon' href='/entericon.png' />
      </Head>

      <DAOvoteList proposals={props.proposals} />
    </div>
  );
}

export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    'mongodb+srv://0x3c:IwMB11GkkHZ4LKyV@cluster0.gnlmiqz.mongodb.net/dao?retryWrites=true&w=majority'
  );
  const db = client.db();

  const proposalsCollection = db.collection('dao_proposal');
  const filterProposal = await proposalsCollection
    .aggregate([
      {
        $group: {
          _id: '$id',
          max_date: {
            $max: '$time',
          },
          records: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $project: {
          items: {
            $filter: {
              input: '$records',
              as: 'records',
              cond: {
                $eq: ['$$records.time', '$max_date'],
              },
            },
          },
        },
      },
      {
        $unwind: '$items',
      },
      {
        $replaceWith: '$items',
      },
    ])
    .toArray();
  console.log(filterProposal);

  // const proposals = await proposalsCollection.find().toArray();

  client.close();

  return {
    props: {
      proposals: filterProposal.map((proposal) => ({
        title: proposal.title,
        time: proposal.time,
        reason: proposal.content,
        voteY: proposal.voteY,
        voteN: proposal.voteN,
        id: proposal.id,
      })),
    },
    revalidate: 1,
  };
}

export default DAOProposalVote;
