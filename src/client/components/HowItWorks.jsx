// HowItWorks.js
import React from 'react';
import style from './HowItWorks.module.scss';
import { FaPlus, FaUser, FaHeart } from 'react-icons/fa';
import { MdWavingHand } from "react-icons/md";

const HowItWorks = () => {
  return (
    <>
      <div className={style.steps}>
        <div className={style.step}>
          <FaUser className={style.icon} />
          <h3>Create an Account</h3>
          <p>Sign up to join the community. You’ll need to provide some basic information to get started.</p>
        </div>
        <div className={style.step}>
          <FaPlus className={style.icon} />
          <h3>Ask for help</h3>
          <p>Need help? Create a post detailing what you’re asking for.</p>
        </div>
        <div className={style.step}>
          <MdWavingHand className={style.icon} />
          <h3>Offer to help</h3>
          <p>Show interest or offer assistance by reacting to posts that resonate with you. Connect and help out!</p>
        </div>
      </div>

    </>
  );
};

export default HowItWorks;
