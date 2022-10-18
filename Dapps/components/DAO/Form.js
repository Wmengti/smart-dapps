import { useRef, useState, useContext } from 'react';
import styles from './Form.module.css';

import { useRouter } from 'next/router';
import WalletContext from '../../store/wallet-context';

const Form = (props) => {
  const router = useRouter();
  const adviceInputRef = useRef();
  const proposalNameInputRef = useRef();
  const proposalReasonInputRef = useRef();
  const WalletCtx = useContext(WalletContext);
  const voteID = WalletCtx.voteID;
  function submitHandler(event) {
    event.preventDefault();
    let daoData;
    if (props.isAdvice) {
      daoData = {
        type: 'advice',
        time: new Date(),
        content: adviceInputRef.current.value,
      };
    } else {
      WalletCtx.newId();
      daoData = {
        id: `ID ${voteID}`,
        type: 'proposal',
        time: new Date(),
        title: proposalNameInputRef.current.value,
        content: proposalReasonInputRef.current.value,
        voteY: 0,
        voteN: 0,
      };
    }
    props.onSubmit(daoData);
    router.push('#DAO');
  }
  return (
    <div>
      {props.isAdvice ? (
        <form onSubmit={submitHandler} className={styles.form}>
          <div className={styles.form_group}>
            <label htmlFor='advice' className={styles.form_label}>
              ADVICE
            </label>
            <textarea
              id='advice'
              className={styles.advice_textarea}
              rows='10'
              cols='60'
              required
              maxlength='300'
              minlength='20'
              ref={adviceInputRef}
            ></textarea>
          </div>
          <div>
            <button className={styles.advice_btn} type='submit'>
              Submit
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={submitHandler} className={styles.form}>
          <div className={styles.form_group}>
            <h3 className={styles.form_label}>New Proposal</h3>
            <label htmlFor='name' className={styles.form_label_proposal}>
              NFT name to apply for invest
            </label>
            <input
              id='name'
              required
              ref={proposalNameInputRef}
              placeholder='full name of the nft'
            />

            <label htmlFor='reason' className={styles.form_label_proposal}>
              Reason for invest
            </label>
            <textarea
              id='advice'
              className={styles.advice_textarea}
              rows='10'
              cols='60'
              required
              maxlength='300'
              minlength='20'
              ref={proposalReasonInputRef}
            ></textarea>
          </div>
          <div>
            <button className={styles.advice_btn} type='submit'>
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default Form;
