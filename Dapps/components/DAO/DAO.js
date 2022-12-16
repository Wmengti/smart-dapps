import { Fragment, useContext, useEffect, useState, useRef } from 'react';
import Router from 'next/router';

import WalletContext from '../../store/wallet-context';
import styles from './DAO.module.css';
import Modal from './Modal';

const DAO = () => {
  const walletCtx = useContext(WalletContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdvice, setIsAdvice] = useState();

  const isOpenHandler = () => {
    setIsOpen(true);
    console.log(isOpen);
  };
  const isCloseHandler = () => {
    setIsOpen(false);
  };

  const AdviceHandler = () => {
    isOpenHandler();
    setIsAdvice(true);
  };
  const ProposalHandler = () => {
    isOpenHandler();
    setIsAdvice(false);
  };
  const onKeyDown = (event) => {
    if (event.keyCode === 27) {
      isCloseHandler();
    }
  };

  return (
    <Fragment>
      <div id='DAO' className={styles.section_dao}>
        <h2 className={styles.section_topic}>
          Ready to contribute to our DAO ?
        </h2>
        <div className={styles.dao_main}>
          <div className={styles.dao_grid}>
            {/* <div> */}
            <div className={styles.mobile_desc}>
              <p className={styles.mobile_desc_text}>Click to advice</p>
            </div>
            <button className={styles.dao_btn_advice} onClick={AdviceHandler}>
              <img className={styles.dao_advice_img} src='/advice.png' />
              <p className={styles.dao_advice_dsc}>advice: ##1</p>
              <div className={styles.dao_advice_dotted}></div>
              <div className={styles.dao_advice_enter}>enter</div>
            </button>
            {/* </div> */}
            {/* <div> */}
            <div className={styles.mobile_desc}>
              <p className={styles.mobile_desc_text}>Click to proposal</p>
            </div>
            <button className={styles.dao_btn_advice} onClick={ProposalHandler}>
              <p className={styles.dao_proposal_dsc}># proposal </p>

              <div className={styles.dao_proposal_line_1}></div>
              <div className={styles.dao_proposal_line_2}></div>
              <div className={styles.dao_proposal_line_3}></div>

              <div className={styles.dao_single_proposal}>
                <img className={styles.dao_proposal_img} src='/man.png' />
                <div>
                  <h3 className={styles.dao_proposal_name}>Elonmusk</h3>
                  <p className={styles.dao_proposal_text}>
                    We can buy bayc #533
                  </p>
                </div>
              </div>
            </button>
            {/* </div> */}
            {/* <div> */}
            <div className={styles.mobile_desc}>
              <p className={styles.mobile_desc_text}>Click to vote</p>
            </div>
            <button
              className={styles.dao_btn_advice}
              onClick={() => Router.push('/votefordao/vote')}
            >
              <div className={styles.dao_vote_proposal}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='1.5'
                  stroke='currentColor'
                  className={styles.dao_vote_icon}
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <p>vote for buying bayc #533</p>
              </div>
              <div className={styles.dao_single_proposal}>
                <img className={styles.dao_proposal_img} src='/man.png' />
                <div>
                  <h3 className={styles.dao_proposal_name}>Elonmusk</h3>
                  <p className={styles.dao_proposal_text}>
                    We can buy bayc #533
                  </p>
                </div>
              </div>
            </button>
            {/* </div> */}

            <div>
              <p className={styles.dao_btn_advice_desc}>
                If you have any advice for sustainable development.{' '}
                <span style={{ fontWeight: 600 }}>Click above!</span>
              </p>
            </div>
            <div>
              <p className={styles.dao_btn_advice_desc}>
                You can initiate a proposal to decide to buy NFT.{' '}
                <span style={{ fontWeight: 600 }}>Click above!</span>{' '}
              </p>
            </div>

            <div>
              <p className={styles.dao_btn_advice_desc}>
                NFT owners can vote proposals.{' '}
                <span style={{ fontWeight: 600 }}>Click above!</span>{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
      {isOpen ? (
        <Modal
          isAdvice={isAdvice}
          isClose={isCloseHandler}
          onKeyDown={onKeyDown}
        />
      ) : null}
    </Fragment>
  );
};

export default DAO;
