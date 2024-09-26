import FeaturedCategories from '../components/Posts/FeaturedCategories'
import s from './Home.module.scss'
import HeroImg from '../assets/images/pexels-ketut-subiyanto-4246061.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Footer } from 'flowbite-react'
import Feed, { showAs } from '../components/Posts/Feed'
import { useUser } from '../api/users/useUser'
import HeroImg2 from '../assets/images/pexels-photo-5561310.jpeg'

const Home = () => {
  const { isLoggedIn } = useUser()
  const filters = {
    featuredPosts: 1 // need to take care
  }

  const navigate = useNavigate()

  return (

    <div>

      {/* Hero Banner */}
      <div className={s.heroImgCrop}>
        <div className={s.overPhoto}>
          <h1 className={s.highfiveTitle}>Meet new friends</h1>
          <p className={s.highfiveText}>
            Need a hand or want to lend one? Give and Take is your go-to app for asking for help and connecting with
            people ready to assist. Build a stronger community through acts of kindness and support. Join now and make a
            difference today!
          </p>
          <Button size="xl" onClick={() => navigate('/explore')} color="light" pill>
            Start now
          </Button>
        </div>
        <img src={HeroImg} />
      </div>

      <div className={s.featuredCategoriesWrap}>
        <p className={s.title}>Categories {'>'}</p>
        <FeaturedCategories />
      </div>

      {/* Stats */}
      <div className={s.statsWrap}>
        <h2 className={s.title1}>Let the world help you.</h2>
        <h6 className={s.title2}>ON GIVEN'TAKE:</h6>

        <div className={s.statsBoxes}>
          <div className={s.box}>
            <p className={s.title}>9,081</p>
            <p className={s.text}>posts</p>
          </div>
          <div className={s.box}>
            <p className={s.title}>20,230</p>
            <p className={s.text}>interested to help</p>
          </div>
          <div className={s.box}>
            <p className={s.title}>+1000</p>
            <p className={s.text}>Users</p>
          </div>
        </div>
      </div>

      {/* Featured posts */}
      <p className={s.featuredPostsTitle}>Featured posts</p>
      <Feed {...{ filters, isLoggedIn }} styleOrder={showAs.ROW} noTitle noActions noDescription featuredPosts />

      {/* Hero Banner */}
      <div className={s.heroImgCrop}>
        <div className={s.overPhoto}>
          <h1 className={s.highfiveTitle}>Meet new friends</h1>
          <p className={s.highfiveText}>
            Need a hand or want to lend one? Give and Take is your go-to app for asking for help and connecting with
            people ready to assist. Build a stronger community through acts of kindness and support. Join now and make a
            difference today!
          </p>
          <Button size="xl" onClick={() => navigate('/explore')} color="light" pill>
            Start now
          </Button>
        </div>
        <img src={HeroImg} />
      </div>

      {/* Hero Banner 2 */}
      <div className={s.heroBanner}>
        <div className={s.imgCrop}>
          <img src={HeroImg2} />
        </div>
        <div className={s.textWrap}>
          <h1>Empowering Community Connections</h1>
          <p>
            Need a hand or want to lend one? Give and Take is your go-to app for asking for help and connecting with
            people ready to assist. Build a stronger community through acts of kindness and support. Join now and make a
            difference today!
          </p>
        </div>
      </div>
      {/* <hr style={{ margin: '0 -1.25em' }} /> */}
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
  )
}

export default Home
