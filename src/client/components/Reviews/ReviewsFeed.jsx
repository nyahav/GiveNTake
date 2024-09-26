import React from 'react';
import styles from "./ReviewsFeed.module.scss";
import Review from './Review';
import { Spinner } from 'flowbite-react';


const ReviewsFeed = ({ reviews }) => {
    return (
        <div className={styles.feed}>
            {reviews ?
                reviews.map((review) => {
                    const userFullName = `${review.fromUser?.firstName || ''} ${review.fromUser?.lastName || ''}`
                    const profileImgUrl = review.fromUser?.imgUrl;
                    return <Review
                        key={review._id}
                        profilePic={profileImgUrl}
                        createdAt={review.createdAt}
                        description={review.description}
                        rating={review.rating}
                        userFullName={userFullName}
                    />;
                }) :
                <Spinner />
            }
        </div>
    );
};

export default ReviewsFeed;