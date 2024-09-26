import React, { useRef } from 'react';
import style from './HomeV2.module.scss';
import { FaAnglesDown } from "react-icons/fa6";
import { useUser } from '../api/users/useUser';
import { Button, Footer } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import HowItWorks from '../components/HowItWorks';
import HeroBanner2 from '../components/HeroBanner2';
import Feed, { showAs } from '../components/Posts/Feed';
import FeaturedCategories from '../components/Posts/FeaturedCategories';

const HomeV2 = () => {
  const nextSectionRef = useRef(null);
  const { isLoggedIn } = useUser()
  const filters = { featuredPosts: 1 };
  const navigate = useNavigate();

  const handleArrowClick = () => {
    if (nextSectionRef.current) {
      nextSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className={style.banner}>
        <div className={style.bannerTitle}>
          <h1>Small acts, big impact.</h1>
        </div>
        <div className={style.bannerText}>
          <p>Need a hand or want to lend one? Given'take is your go-to app for asking for help and connecting with
            people ready to assist. Build a stronger community through acts of kindness and support.</p>
        </div>
        <Button className={style.startButton} size="" color="white" onClick={() => navigate('/explore')} >
          Start now
        </Button>
        <FaAnglesDown
          className={style.downArrow}
          onClick={handleArrowClick}
          role="button"
          aria-label="Scroll Down"
        />
      </div>

      <div ref={nextSectionRef}>

        <div className={style.fadeIn}>
          <HeroBanner2 />
        </div>

        <div className={style.fadeIn}>
          <p className={style.title}>How Given'take Works</p>
          <HowItWorks />
        </div>
        {/*
        <div className={style.fadeIn}>
          <p className={style.title}>Choose a Category to Get Started</p>
          <FeaturedCategories />
        </div>

        <div className={style.fadeIn}>
          <p className={style.title}>Discover Opportunities to Help</p>
          <div className={style.feedContainer}>
            <Feed {...{ filters, isLoggedIn }} styleOrder={showAs.ROW} noTitle noActions noDescription featuredPosts />
          </div>
        </div>
        */}

        <Footer container>
          <Footer.Copyright by="Given'take™" year={2024} />
          <Footer.LinkGroup>
            <Link className="mr-2" to="/explore">
              Explore
            </Link>
            {isLoggedIn && (
              <>
                <Link className="mr-2" to="/feed">
                  For you
                </Link>
                <Link className="mr-2" to="/messages">
                  Messages
                </Link>
              </>
            )}
            {!isLoggedIn && (
              <Link className="mr-2" to="/auth?mode=login">
                Sign in/up
              </Link>
            )}
          </Footer.LinkGroup>
        </Footer>

      </div>
    </>
  );
};

export default HomeV2;
