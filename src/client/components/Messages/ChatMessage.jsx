import React from 'react';
import styles from './ChatMessage.module.scss';
import { format } from 'date-fns';

const ChatMessage = ({ message, profileImg, fromSelf, date, showTitleDate }) => {
  const currDate = new Date();

  return (
    <>
      {showTitleDate && <div className={styles.date}>{format(date, 'dd/MM')}</div>}

      <div className={`${styles.messageWrapper} ${fromSelf && styles.alignRight}`}>
        {profileImg && (
          <div className={`${styles.profileImg} ${fromSelf && styles.right}`}>
            <img src={profileImg} alt="Profile Pic" />
          </div>
        )}

        <div className={styles.message}>
          {message}
          <p className={styles.time}>{format(date, 'HH:mm')}</p>
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
