import React from 'react';
import style from './HeroBanner2.module.scss';
import HeroImg2 from '../assets/images/pexels-photo-5561310.jpeg';

const Hero2Banner = () => {
  return (

    <div className={style.banner}>
      <div className={style.heroBanner}>
        <div className={style.textWrap}>
          <h2>Empowering Community Connections</h2>
          <p>
            Experience the power of your city's collective heart. Given'take is more than just an app; it's a platform for fostering stronger, more supportive city-wide connections.
          </p>
          <ul>
            <li><strong>Give and receive help:</strong> Ask for assistance or offer your skills and time to help fellow residents.</li>
            <li><strong>Forge meaningful bonds:</strong> Connect with people across your city and build lasting relationships.</li>
            <li><strong>Create a ripple effect of kindness:</strong> Every act of helping strengthens the fabric of our entire city.</li>
          </ul>
        </div>

        <div className={style.imgCrop}>
          <img src={HeroImg2} alt="Community Connection" />
        </div>
      </div>
    </div>
  );
};

export default Hero2Banner;
