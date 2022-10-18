import Card from '../UI/Card';
import moment from 'moment';
import styles from './DAOvoteDetail.module.css';
import { useEffect, useRef } from 'react';
const DAOvoteDetail = (props) => {
  const detailRef = useRef();
  const detailSubRef = useRef();
  useEffect(() => {
    const closeDropDown = (event) => {
      if (detailSubRef.current && detailSubRef.current.contains(event.target))
        return;
      if (detailRef.current && detailRef.current.contains(event.target)) {
        props.isClose();
      }
    };
    document.body.addEventListener('click', closeDropDown);
    return () => document.body.removeEventListener('click', closeDropDown);
  }, []);

  return (
    <div className={styles.voteDetail} ref={detailRef}>
      <div className={styles.voteDetail_sub} ref={detailSubRef}>
        <Card>
          <div>{props.id}</div>
          <div>{moment(props.time).format('YYYY-MM-DD h:mma')}</div>
          <div>
            <span style={{ color: 'blue' }}>NFT:</span>
            {props.nft}
          </div>
          <div>
            <span style={{ color: 'blue' }}>REASON:</span>
            {props.reason}
          </div>
        </Card>

        <button onClick={props.isClose} className={styles.voteDetail_btn}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className={styles.modal_icon}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DAOvoteDetail;
