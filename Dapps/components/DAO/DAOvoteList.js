import styles from './DAOvoteList.module.css';
import DAOvoteItem from './DAOvoteItem';

const DAOvoteList = (props) => {
  return (
    <div className={styles.DAOvoteList}>
      <h2 className={styles.DAOvoteList_title}>Proposal vote</h2>
      <div className={styles.DAOvoteList_nest}>
        <ul className={styles.DAOvoteList_discribe}>
          {props.proposals.map((proposal) => (
            <DAOvoteItem
              key={proposal.id}
              id={proposal.id}
              title={proposal.title}
              time={proposal.time}
              reason={proposal.reason}
              voteY={proposal.voteY}
              voteN={proposal.voteN}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DAOvoteList;
