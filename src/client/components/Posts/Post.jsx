import { useEffect, useState } from 'react'
import styles from './Post.module.scss'
import ProfilePic from '../../assets/images/profile-img.jpeg'
import BookmarkIcon from '../../assets/images/bookmark-icon-black.svg'
import BookmarkIconFilled from '../../assets/images/bookmark-icon-black-filled.svg'
import FilledHandWaving from '../../assets/images/hand_waving_icon_filled.svg'
import HandWaving from '../../assets/images/hand_waving_icon.svg'
import FlagIcon from '../../assets/images/flag-icon-v2.svg'
import FilledFlagIcon from '../../assets/images/flag-filled-icon.svg'
import { Button, Modal, Popover, Tooltip } from 'flowbite-react'
import { usePostAction } from '../../api/posts/usePostAction'
import { FaExpandAlt, FaEyeSlash } from 'react-icons/fa'
import ReportModal from './ReportModal'
import PostSkeleton from './PostSkeleton'
import { Link, useNavigate } from 'react-router-dom'
import InterestedModal from './InterestedModal'
import { useSnackbar } from 'notistack'
import { MdDeleteOutline } from 'react-icons/md'
import { HiOutlinePencilSquare } from 'react-icons/hi2'
import { FaAngleDoubleUp } from 'react-icons/fa'
import { IoMdMore } from 'react-icons/io'
import { calculateTimeAgo } from '../../utils/lib'
import useBumpPost from '../../api/posts/useBumpPost'
import PostForm from './PostForm'
import { useUpdatePost } from '../../api/posts/useUpdatePost'
import useDeletePost from '../../api/posts/useDeletePost'
import ConfirmationModal from '../ConfirmationModal'
import { BsStars } from 'react-icons/bs'

const Post = ({
  postAction,
  post,
  userId,
  isLoggedIn,
  MAX_DESCRIPTION_LENGTH_W_PHOTO = 150,
  MAX_DESCRIPTION_LENGTH_NO_PHOTO = 450,
  postId,
  fullName,
  profilePic = '',
  createdAt,
  helpDate,
  location = '',
  postPic = '',
  title = '',
  description = '',
  interested = 0,
  isSavedByUser,
  isUserInterested,
  isUserReported,
  postInModal = false,
  openModalHandler,
  isLoading,
  noTitle,
  noActions,
  isSelf,
  onEdit,
  featuredPost
}) => {
  // const [wantToHelpCount, setWantToHelpCount] = useState(interested); // Manage like counter
  // setWantToHelpCount((prevCount) => (!isUserInterested ? prevCount + 1 : prevCount - 1));

  const navigate = useNavigate()
  // const [showMoreActive, setShowMoreActive] = useState(postInModal);
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showInterestedModal, setShowInterestedModal] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { mutate: bumpPost } = useBumpPost()
  const { mutate: deletePost } = useDeletePost()

  const onPostAction = data => {
    if (isLoggedIn) postAction(data)
    else enqueueSnackbar('You need to login to perfom this action.', { variant: 'info' })
  }

  const toggleSaveForLater = () => {
    onPostAction({ postId, actions: { isSavedByUser: !isSavedByUser } })
  }

  const toggleHelp = () => {
    if (isUserInterested) {
      onPostAction({
        postId,
        actions: { isUserInterested: !isUserInterested }
      })
    } else {
      setShowInterestedModal(true)
    }
  }

  // sets how long ago the post was posted
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    setTimeAgo(calculateTimeAgo(createdAt))

    // Update the time every minute
    const interval = setInterval(calculateTimeAgo, 60000)

    //interval cleanup
    return () => clearInterval(interval)
  }, [createdAt])

  //control description length
  let postDescription = description
  const descriptionMaxLength = postPic ? MAX_DESCRIPTION_LENGTH_W_PHOTO : MAX_DESCRIPTION_LENGTH_NO_PHOTO
  let cutDescription =
    postDescription.length > descriptionMaxLength ? (
      <>
        {/* {postDescription.substring(0, descriptionMaxLength)} */}
        <u> Read More</u>
      </>
    ) : (
      postDescription
    )

  const postTag = (
    <div
      className={`${styles.post} ${isUserReported ? styles.reportedPost : ''} ${featuredPost && !postInModal ? styles.featuredPost : ''
        }`}>
      <div className={isUserReported ? styles.reportedPostInnerWrap : ''}>
        {(!noTitle || postInModal) && (
          <div className={styles.postHeader}>
            <div className="flex">
              {profilePic && <img src={profilePic} alt="Profile" className={styles.profilePic} />}
              <div>
                <h6 onClick={() => navigate(`/profile/${userId}`)} style={{ cursor: 'pointer' }}>
                  {fullName}
                </h6>
                <p>
                  {timeAgo}{' '}
                  {location?.city && location?.country ? `• ${location.city}, ${location.country}` : '• Remote help'}
                </p>
              </div>
            </div>
            <div className={styles.actions}>
              {isLoggedIn && isSelf && (
                <Popover
                  placement="left"
                  trigger="click"
                  aria-labelledby="profile-popover"
                  content={
                    <div className={styles.popover}>
                      <span onClick={() => bumpPost({ postId })}>
                        <FaAngleDoubleUp />
                        <span>Bump post</span>
                      </span>
                      <span onClick={onEdit}>
                        <HiOutlinePencilSquare />
                        <span>Edit</span>
                      </span>
                      <hr />
                      <span onClick={() => setShowDeleteModal(true)}>
                        <MdDeleteOutline />
                        <span>Delete</span>
                      </span>
                    </div>
                  }>
                  <IoMdMore className={styles.btnMore} />
                </Popover>
              )}

              {post?.isInterestPost && (
                <div className={styles.postFromInterests} style={{ textWrap: 'nowrap' }}>
                  <Tooltip content="post from your interests">
                    <BsStars color="var(--third-color)" style={{ cursor: 'help' }} />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`${styles.postBody} ${featuredPost && !postInModal ? styles.featuredPost : ''}`}>
          <div
            {...(!postInModal && {
              onClick: openModalHandler,
              style: { cursor: 'pointer' }
            })}>
            {postPic && (
              <div className={`${styles.imgCrop} ${featuredPost && !postInModal ? styles.featuredPost : ''}`}>
                <img src={postPic} alt="Post" />
              </div>
            )}
            <h6 className={styles.title}><strong>{title}</strong></h6>
            {((featuredPost && postInModal) || !featuredPost) && (
              <p>{postInModal ? postDescription : cutDescription}</p>
            )}
          </div>
        </div>
        {!noActions && ((!isSelf && !featuredPost) || (featuredPost && postInModal)) && (
          <div className={styles.postFooter}>
            <div
              style={{
                width: 'fit-content',
                display: 'flex',
                alignItems: 'center'
              }}>
              <div className={styles.likes}>
                <img
                  className={`${styles.likeButton} ${isSavedByUser ? styles.liked : ''} ${!isLoggedIn ? styles.disabled : ''
                    }`} // Add CSS class for styling
                  src={isSavedByUser ? BookmarkIconFilled : BookmarkIcon}
                  {...(isLoggedIn && { onClick: toggleSaveForLater })}
                  alt="Save for Later"
                />
              </div>

              <div className={styles.hand}>
                <Tooltip content={isUserInterested ? 'Press to cancel help' : 'Press to help'}>
                  <div style={{ display: 'flex' }}>
                    <img
                      className={`${styles.wavingHand}  ${!isLoggedIn ? styles.disabled : ''}`}
                      src={isUserInterested ? FilledHandWaving : HandWaving}
                      {...(isLoggedIn && { onClick: toggleHelp })}
                      alt="Help"
                    />
                    {/* <span className={styles.likeCount}>{wantToHelpCount}</span> */}
                  </div>
                </Tooltip>
              </div>
            </div>

            <div className={styles.report}>
              <img
                src={isUserReported ? FilledFlagIcon : FlagIcon}
                {...(isLoggedIn && { onClick: () => setShowReportModal(true) })}
                alt="Report"
                className={!isLoggedIn ? styles.disabled : ''}
              />
            </div>
          </div>
        )}
      </div>

      {isUserReported && (
        <div className={styles.overlay}>
          <FaEyeSlash size={40} />
          <div>Post reported.</div>
        </div>
      )}
    </div>
  )

  return (
    <>
      <ConfirmationModal
        message="Are you sure you want to delete this product?"
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deletePost({ postId })}
      />
      <ReportModal
        show={showReportModal}
        onClose={() => setShowReportModal(false)}
        {...{ postId, isUserReported, onPostAction }}
      />
      <InterestedModal
        show={showInterestedModal}
        onClose={() => setShowInterestedModal(false)}
        {...{ userId, postId, fullName, isUserInterested, onPostAction }}
      />

      {isLoading ? <PostSkeleton /> : postTag}
    </>
  )
}

const PostWithModal = props => {
  const { postId, post, onlyModal } = props || {}

  const { mutate: updatePost, isSuccess: isSuccessUpdatePost } = useUpdatePost()

  const [openModal, setOpenModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const onEditHandler = () => {
    setIsEdit(true)
    setOpenModal(true)
  }

  const onDismissEdit = () => {
    setIsEdit(false)
    setOpenModal(false)
    onlyModal?.onModalClose()
  }

  const onUpdateHandler = formData => {
    updatePost({ data: formData })
  }

  useEffect(() => {
    if (isSuccessUpdatePost) {
      onDismissEdit()
    }
  }, [isSuccessUpdatePost])

  return (
    <>
      <Modal
        size={isEdit ? 'xl' : 'md'}
        dismissible
        show={onlyModal ? onlyModal.showModal : openModal}
        onClose={onDismissEdit}
        className={styles.modalWrap}>
        {isEdit ? (
          <PostForm isEdit {...{ postId, post }} onSubmit={onUpdateHandler} onDismiss={onDismissEdit} />
        ) : (
          <Post {...props} postInModal onEdit={onEditHandler} />
        )}
      </Modal>
      {!onlyModal && <Post {...props} openModalHandler={() => setOpenModal(true)} onEdit={onEditHandler} />}
    </>
  )
}

export default PostWithModal
