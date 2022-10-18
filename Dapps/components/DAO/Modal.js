import styles from './Modal.module.css';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';

import Form from './Form';
import { useState } from 'react';
const Modal = (props) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const submitHandler = async (daoData) => {
    if (props.isAdvice) {
      const response = await fetch('/api/dao_advice', {
        method: 'POST',
        body: JSON.stringify(daoData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      console.log(data);
    } else {
      const response = await fetch('/api/dao_proposal', {
        method: 'POST',
        body: JSON.stringify(daoData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      console.log(data);
    }
    setIsSubmit(true);
  };
  return ReactDOM.createPortal(
    <FocusTrap>
      <aside
        tag='aside'
        role='dialog'
        tabIndex='-1'
        aria-modal='true'
        className={styles.modal_cover}
        onKeyDown={props.onKeyDown}
      >
        <div className={styles.modal_area}>
          <div className={styles.modal_form}>
            <button onClick={props.isClose} className={styles.modal_btn}>
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
            {isSubmit ? (
              <div className={styles.modal_submit}>
                <h2 className={styles.modal_submit_success}>Success submit!</h2>
              </div>
            ) : (
              <Form isAdvice={props.isAdvice} onSubmit={submitHandler} />
            )}
          </div>
        </div>
      </aside>
    </FocusTrap>,
    document.body
  );
};

export default Modal;
