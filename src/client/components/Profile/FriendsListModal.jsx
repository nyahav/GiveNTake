import { Button, Modal, Table } from "flowbite-react";
import { useState } from "react";
import styles from './FriendsListModal.module.scss';
import ProfileImg from '../../assets/images/profile-img.jpeg';
import LoadingSpinner from "../LoadingSpinner";
import { useFriendAction } from "../../api/friends/useFriendAction";
import { Link } from "react-router-dom";


export const modes = {
  FOLLOWERS: 'followers',
  FOLLOWING: 'following'
}

export function FriendsListModal({ show, onClose, mode, friends, isLoading, isMyProfile }) {
  const { mutate: friendAction } = useFriendAction();

  let list = [];
  if (friends && mode === modes.FOLLOWING) list = friends.following;
  else if (friends && mode === modes.FOLLOWERS) { list = friends.followers; }

  const onFriendRowAction = ({ userId }) => {
    if (friends) {
      if (mode === modes.FOLLOWING) {
        friendAction({ toUser: userId, actions: { unfollow: 1 } });
      } else if (mode === modes.FOLLOWERS) {
        friendAction({ toUser: userId, actions: { remove: 1 } });
      }
    }
  };

  return (
    <Modal dismissible {...{ show, onClose }} size='sm'>
      {isLoading || !list?
        <LoadingSpinner /> : <>
          <h6 className={styles.modalTitle}>{mode === modes.FOLLOWERS ? 'Followers' : 'Following'}</h6>
          <div className={styles.modalBody}>

            {list.map((item) => {
              const fullName = `${item.firstName} ${item.lastName}`

              return <div className={styles.row} key={item._id}>
                <span>
                  <Link to={`/profile/${item._id}`}>
                    <span className={styles.profilePictureWrap}>
                      <img src={item.imgUrl || ProfileImg} alt='Profile Image' />
                    </span>
                    <span className={styles.fullName}>{fullName}</span>
                  </Link>
                </span>
                <span className={styles.actions}>
                  {isMyProfile &&
                    <Button size='xs' color='gray' onClick={() => onFriendRowAction({ userId: item._id })}>{mode === modes.FOLLOWERS ? 'Remove' : 'Unfollow'}</Button>
                  }
                </span>
              </div>;
            })}

          </div>
        </>
      }
    </Modal>
  );
}
