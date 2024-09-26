import Stars from './Stars'
import styles from './Review.module.scss'
import ProfileImg from '../../assets/images/profile-img.jpeg'

const Review = ({ userFullName, profilePic, rating, description, createdAt }) => {
  const friendlyCreatedAt = new Date(createdAt).toLocaleDateString('he-IL')
  return (
    <div className={styles.review}>
      <div className={styles.imgCrop}>
        <img src={profilePic || ProfileImg} alt="ProfilePic" className={styles.profilePic} />
      </div>
      <div className={styles.content}>
        <div className={styles.topBar}>
          <h6 className={styles.fullName}>{userFullName}</h6>
          <span>{friendlyCreatedAt}</span>
        </div>
        <span>
          <Stars grade={rating || 0} />
        </span>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  )
}

export default Review
