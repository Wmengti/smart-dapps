import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';
import styles from '../../styles/dao_vote.module.css';
import DAOvoteList from '../../components/DAO/DAOvoteList';
import { id } from 'ethers/lib/utils';

function DAOProposalVote(props) {
  return (
    <div className={styles.dao_vote}>
      <Head>
        <title>Web3.0 Dapps</title>
        <meta name='description' content='WhiteList-Dapp' />
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
