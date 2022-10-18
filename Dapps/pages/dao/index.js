import Head from 'next/head';
import styles from '../../styles/NFT.module.css';

import Web3Modal from 'web3modal';
import { providers, Contract, utils } from 'ethers';
import { useState, useRef, useEffect } from 'react';

import cryptodevsABI from '../../constants/CDabi.json';
import cryptodevsAddress from '../../constants/CDaddress.json';
import daoABI from '../../constants/daoAbi.json';
import daoAddress from '../../constants/daoAddress.json';

export default function NFTcollection() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedTab, setSelectedTab] = useState('');
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [numProposals, setNumProposals] = useState('0');
  const [nftBalance, setNftBalance] = useState(0);
  const [fakeNftTokenId, setFakeNftTokenId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState([]);

  const web3ModalRef = useRef();
  if (typeof window !== 'undefined') {
    web3ModalRef.current = new Web3Modal({
      network: 'rinkeby',
      providerOptions: {},
      disableInjectedProvider: false,
    });
  }

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert('Change the network to Rinkeby');
      throw new Error('Change network to Rinkeby');
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (e) {
      console.error(e);
    }
  };

  // Helper function to return a DAO Contract instance
  // given a Provider/Signer
  const getDaoContractInstance = (providerOrSigner) => {
    return new Contract(daoAddress, daoABI, providerOrSigner);
  };

  // Helper function to return a CryptoDevs NFT Contract instance
  // given a Provider/Signer
  const getCryptodevsNFTContractInstance = (providerOrSigner) => {
    return new Contract(cryptodevsAddress, cryptodevsABI, providerOrSigner);
  };

  const getDAOTreasuryBalance = async () => {
    try {
      const provider = await getProviderOrSigner();
      const balance = await provider.getBalance(daoAddress);
      setTreasuryBalance(balance.toString());
    } catch (error) {
      console.error(error);
    }
  };
  const getNumOfProposals = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = getDaoContractInstance(provider);
      const daoNumProposals = await contract.numProposals();
      setNumProposals(daoNumProposals.toString());
    } catch (error) {
      console.error(error);
    }
  };

  const getUserNFTBalance = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = getCryptodevsNFTContractInstance(signer);
      const _nftBalance = await contract.balanceOf(signer.getAddress());
      setNftBalance(parseInt(_nftBalance.toString()));
    } catch (error) {
      console.error(error);
    }
  };

  const createProposal = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);
      const txn = await daoContract.createProposal(fakeNftTokenId);
      setLoading(true);
      await txn.wait();
      await getNumOfProposals();
      setLoading(false);
    } catch (error) {
      console.error(error);
      window.alert(error.data.message);
    }
  };

  const fetchProposalById = async (id) => {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);
      const proposal = await daoContract.proposals(id);
      const parsedProposal = {
        proposalId: id,
        nftTokenId: proposal.nftTokenId.toString(),
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        yayVotes: proposal.yayVotes.toString(),
        nayVotes: proposal.nayVotes.toString(),
        executed: proposal.executed,
      };
      return parsedProposal;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllProposals = async () => {
    try {
      const proposals = [];
      for (let i = 0; i < numProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals);
      return proposals;
    } catch (error) {
      console.error(error);
    }
  };

  const voteOnproposal = async (proposalId, _vote) => {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);

      let vote = _vote == 'YAY' ? 0 : 1;
      const txn = await daoContract.voteOnProposal(proposalId, vote);
      setLoading(true);
      await txn.wait(1);
      setLoading(false);
      await fetchAllProposals();
    } catch (error) {
      console.error(error);
      window.alert(error.data.message);
    }
  };

  const executeProposal = async (proposalId) => {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);
      const txn = await daoContract.executeProposal(proposalId);
      setLoading(true);
      await txn.wait(1);
      setLoading(false);
      await fetchAllProposals();
    } catch (error) {
      console.error(error);
      window.alert(error.data.message);
    }
  };
  const renderCreateProposalTab = () => {
    if (loading) {
      return (
        <div className={styles.description}>
          Loading... Waiting for transaction...
        </div>
      );
    } else if (nftBalance === 0) {
      return (
        <div className={styles.description}>
          You do not own any CryptoDevs NFTs. <br />
          <b>You cannot create or vote on proposals</b>
        </div>
      );
    } else {
      return (
        <div className={styles.container}>
          <label>Fake NFT Token ID to Purchase: </label>
          <input
            placeholder='0'
            type='number'
            onChange={(e) => setFakeNftTokenId(e.target.value)}
          />
          <button className={styles.button} onClick={createProposal}>
            Create
          </button>
        </div>
      );
    }
  };
  const renderViewProposalsTab = () => {
    if (loading) {
      return (
        <div className={styles.description}>
          Loading... Waiting for transaction...
        </div>
      );
    } else if (proposals.length === 0) {
      return (
        <div className={styles.description}>No proposals have been created</div>
      );
    } else {
      return (
        <div>
          {proposals.map((p, index) => (
            <div key={index} className={styles.proposalCard}>
              <p>Proposal ID: {p.proposalId}</p>
              <p>Fake NFT to Purchase: {p.nftTokenId}</p>
              <p>Deadline: {p.deadline.toLocaleString()}</p>
              <p>Yay Votes: {p.yayVotes}</p>
              <p>Nay Votes: {p.nayVotes}</p>
              <p>Executed?: {p.executed.toString()}</p>
              {p.deadline.getTime() > Date.now() && !p.executed ? (
                <div className={styles.flex}>
                  <button
                    className={styles.button}
                    onClick={() => voteOnproposal(p.proposalId, 'YAY')}
                  >
                    Vote YAY
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => voteOnproposal(p.proposalId, 'NAY')}
                  >
                    Vote NAY
                  </button>
                </div>
              ) : p.deadline.getTime() < Date.now() && !p.executed ? (
                <div className={styles.flex}>
                  <button
                    className={styles.button}
                    onClick={() => executeProposal(p.proposalId)}
                  >
                    Execute Proposal{' '}
                    {p.yayVotes > p.nayVotes ? '(YAY)' : '(NAY)'}
                  </button>
                </div>
              ) : (
                <div className={styles.description}>Proposal Executed</div>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  const renderTabs = () => {
    if (selectedTab == 'Create Proposal') {
      return renderCreateProposalTab();
    } else if (selectedTab == 'View Proposals') {
      return renderViewProposalsTab();
    }
    return null;
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      connectWallet();
    }
    getDAOTreasuryBalance();
    getNumOfProposals();
    getUserNFTBalance();
  }, [walletConnected]);

  useEffect(() => {
    if (selectedTab === 'View Proposals') {
      fetchAllProposals();
    }
  }, [selectedTab]);

  return (
    <div>
      <Head>
        <title>CryptoDevs DAO</title>
        <meta name='description' content='CryptoDevs DAO' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.container}>
        <div className={styles.main}>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>Welcome to the DAO!</div>
          <div className={styles.description}>
            Your CryptoDevs NFT Balance: {nftBalance}
            <br />
            Treasury Balance: {utils.formatEther(treasuryBalance)} ETH
            <br />
            Total Number of Proposals: {numProposals}
          </div>
          <div>
            <button
              className={styles.button}
              onClick={() => setSelectedTab('Create Proposal')}
            >
              Create Proposal
            </button>
            <button
              className={styles.button}
              onClick={() => setSelectedTab('View Proposals')}
            >
              View Proposals
            </button>
            {renderTabs()}
          </div>
        </div>
        <img
          className={styles.image}
          src='./crypto-devs.svg'
          alt='people have an NFT collection'
        />
        <footer className={styles.footer}>
          Made with&#10084; by Crypto Devs
        </footer>
      </div>
    </div>
  );
}
