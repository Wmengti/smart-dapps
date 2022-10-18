import { useRef, useState } from 'react';
import Card from '../UI/Card';
import styles from './DAOvoteItem.module.css';
import moment from 'moment';
import Router from 'next/router';
import DAOvoteDetail from './DAOvoteDetail';

const DAOvoteItem = (props) => {
  const [isVoteY, setIsVoteY] = useState(false);
  const [isVoteN, setIsVoteN] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [voteYnum, setVoteYnum] = useState(props.voteY);
  const [voteNnum, setVoteNnum] = useState(props.voteN);
  const voteYRef = useRef();
  const voteNRef = useRef();
  voteYRef.current = props.voteY;
  voteNRef.current = props.voteN;
  const voteYHandle = () => {
    setIsVoteY(!isVoteY);

    if (!isVoteY) {
      voteYRef.current++;
      setVoteYnum(voteYRef.current);
    } else {
      setVoteYnum(voteYRef.current);
    }

    const proposalDate = {
      id: props.id,
      type: 'proposal',
      time: new Date(),
      title: props.title,
      content: props.reason,
      voteY: voteYRef.current,
      voteN: voteNRef.current,
    };
    console.log(proposalDate);
    fetchHandler(proposalDate);
  };
  const voteNHandle = () => {
    setIsVoteN(!isVoteN);
    if (!isVoteN) {
      voteNRef.current++;
      setVoteNnum(voteNRef.current);
    } else {
      setVoteNnum(voteNRef.current);
    }
    const proposalDate = {
      id: props.id,
      type: 'proposal',
      time: new Date(),
      title: props.title,
      content: props.reason,
      voteY: voteYRef.current,
      voteN: voteNRef.current,
    };
    fetchHandler(proposalDate);
  };

  const voteDetailHandler = () => {
    setIsDetail(!isDetail);
  };

  const fetchHandler = async (proposalDate) => {
    const response = await fetch('/api/dao_proposal', {
      method: 'POST',
      body: JSON.stringify(proposalDate),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    console.log(data);
  };

  return (
    <li className={styles.voteItem_li}>
      <Card>
        <div>{props.id}</div>
        <div>{moment(props.time).format('YYYY-MM-DD h:mma')}</div>
        <div>
          <span style={{ color: 'blue' }}>NFT:</span>
          {props.title.substring(0, 14)}
          ...
        </div>
        <div>
          <span style={{ color: 'blue' }}>REASON:</span>
          {props.reason.substring(0, 40)}...
          <button className={styles.vote_btn} onClick={voteDetailHandler}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              className={styles.vote_desc}
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5'
              />
            </svg>
          </button>
        </div>
        <div className={styles.vote_yn}>
          <button onClick={voteYHandle} className={styles.vote_btn}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              className={isVoteY ? styles.vote_icon_click : styles.vote_icon}
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z'
              />
            </svg>
          </button>
          <div>{voteYnum}</div>

          <button onClick={voteNHandle} className={styles.vote_btn}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              className={isVoteN ? styles.vote_icon_click : styles.vote_icon}
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384'
              />
            </svg>
          </button>
          <div>{voteNnum}</div>
        </div>
      </Card>
      {isDetail ? (
        <DAOvoteDetail
          key={props.id}
          id={props.id}
          time={moment(props.time).format('YYYY-MM-DD h:mma')}
          nft={props.title}
          reason={props.reason}
          isClose={voteDetailHandler}
        />
      ) : (
        ''
      )}
    </li>
  );
};

export default DAOvoteItem;
