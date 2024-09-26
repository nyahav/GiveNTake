import styled from 'styled-components'
import ProfileImg from '../../assets/images/profile-img.jpeg'
import { differenceInDays, isSameDay } from 'date-fns'
import { useState, useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage'
import { Button, TextInput, Textarea } from 'flowbite-react'
import CloseIcon from '../../assets/images/CloseIcon.svg'
import { IoSendSharp } from 'react-icons/io5'
import { isObjectEmpty } from '../../utils/lib'
import { FaRegStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { ReviewAskModal } from '../Reviews/ReviewAskModal'

export default function ChatBox({ conversation, sendMessage, onClose, selfUserId }) {
  const navigate = useNavigate()
  const [showReviewModal, setShowReviewModal] = useState(undefined)

  const [message, setMessage] = useState('')
  const scrollableDivRef = useRef(null)

  const onSendMessage = () => {
    setMessage('')
    sendMessage(message)
  }

  const onKeyDownHandler = e => {
    const KEY_ENTER = 13
    if (!e.shiftKey && e.keyCode === KEY_ENTER) {
      onSendMessage()
    }
  }

  useEffect(() => {
    scrollableDivRef.current?.lastElementChild?.scrollIntoView({
      // behavior: 'smooth',
      block: 'end'
    })

    //TODO: set all messages read
  }, [conversation])

  return (
    <$Wrapper>
      {!isObjectEmpty(conversation) && (
        <>
          <div className="chatHeader">
            <div className="imgCrop">
              <img className="rounded-full" src={conversation?.otherUsers[0]?.imgUrl || ProfileImg} alt="Profile Pic" />
            </div>
            <div className="userInfo">
              <p
                style={{ padding: '10px', cursor: 'pointer' }}
                onClick={() => navigate(`/profile/${conversation?.otherUsers[0]._id}`)}>
                <strong>
                  {conversation?.otherUsers[0]
                    ? conversation?.otherUsers[0].firstName + ' ' + conversation?.otherUsers[0].lastName
                    : 'Deleted user'}
                </strong>
              </p>
              {window.innerWidth < 768 && (
                <div className="exitIcon" onClick={onClose}>
                  <img src={CloseIcon} alt="Exit Icon" />
                </div>
              )}
            </div>
          </div>

          {conversation?.post && (
            <div className="chatPost">
              <div>
                <p>{conversation.post.title}</p>
                {showReviewModal !== false &&
                  !conversation.post?.reviewToUser &&
                  conversation.post.user === selfUserId && (
                    <>
                      <Button color="light" size="sm" className="mt-1" onClick={() => setShowReviewModal(true)}>
                        Write review
                      </Button>
                      <ReviewAskModal
                        toUser={conversation?.otherUsers[0]._id}
                        postId={conversation.post._id}
                        show={showReviewModal}
                        onClose={() => setShowReviewModal(false)}
                      />
                    </>
                  )}
              </div>
              {conversation.post?.imgUrl && <img src={conversation.post.imgUrl} />}
            </div>
          )}
          <div className="chatBody" ref={scrollableDivRef}>
            {conversation?.messages?.map((message, index) => {
              const previousDate =
                index > 0 ? conversation.messages[index - 1].createdAt : conversation.messages[0].createdAt

              const currDate = new Date(message.createdAt)
              const isSameDate = isSameDay(new Date(previousDate), currDate)

              const profileImg = conversation.users.find(user => user._id === message.sender)?.imgUrl

              return (
                <ChatMessage
                  key={message._id}
                  message={message.body.text}
                  fromSelf={message.fromSelf}
                  date={currDate}
                  showTitleDate={!isSameDate || index === 0}
                  profileImg={profileImg}
                />
              )
            })}
            {/* important place holder dont delete this div! it is for the scroll function */}
            <div></div>
          </div>

          <div className="chatFooter">
            <Textarea
              className="inputMessage"
              id="messageText"
              type="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Enter message"
              required
              shadow
              onKeyUp={conversation?.otherUsers[0] ? onKeyDownHandler : () => {}}
              disabled={!conversation?.otherUsers[0]}
            />
            <IoSendSharp
              size="1.3em"
              color="#fff"
              className="sendButton"
              disabled={!conversation?.otherUsers[0]}
              onClick={conversation?.otherUsers[0] ? onSendMessage : () => {}}
            />
          </div>
        </>
      )}
    </$Wrapper>
  )
}

const $Wrapper = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .chatHeader {
    position: relative;
    display: flex;
    align-items: center;
    column-gap: 10px;
    border-top-right-radius: 5px;
    margin-bottom: 3px;
    background-color: #fff;
    height: 3.1rem;
    padding: 0.5em;

    .imgCrop {
      height: 100%;

      img {
        height: 100%;
      }
    }

    p {
      margin: unset;
    }

    .userInfo {
      display: flex;
      justify-content: space-between;
      flex-grow: 1;
      padding: auto;

      .exitIcon {
        padding: 7px;
        cursor: pointer;
      }
    }
  }
  .chatPost {
    display: flex;
    gap: 2em;
    padding: 1em;
    padding-top: 0;
    flex-wrap: wrap;
    border-bottom: 1px solid #ccc;
    & > div {
      flex: 1;

      p {
        margin: 0;
        word-break: break-word;
        font-size: 0.9em;
      }
    }

    img {
      width: 3em;
      height: 3em;
      border-radius: 10em;
      flex-shrink: 0;
    }
  }

  .chatBody {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    row-gap: 10px;
    flex-grow: 1;
    overflow: auto;
    padding: 0.3em;
    background-color: #f3f4f6;

    .logo {
      position: absolute;
      // margin-left: 31vw;
      color: green;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.3;
      pointer-events: none;

      h1 {
        margin-bottom: unset;
      }
    }
  }

  .chatFooter {
    background: #fff;
    display: flex;
    justify-content: space-between;
    width: 100%;
    bottom: 0;
    min-height: 4rem;
    max-height: 10rem;
    align-items: center;
    border-top: 2px #ddd solid;

    .inputMessage {
      resize: none;
      background: #fff;
      border: 0;
      border-radius: 0;
      resize: none;
      margin: 0;
      width: 100%;
      border-radius: unset;
      outline: none;
      height: 100%;

      &:focus {
        outline: none;
        border: 0;
        --tw-ring-opacity: 0;
      }
    }

    .sendButton {
      background: var(--forth-color);
      padding: 0.3em 0.6em 0.3em 0.8em;
      box-sizing: content-box;
      border-radius: 1em;
      cursor: pointer;
      margin-right: 0.4em;
    }
  }
`
