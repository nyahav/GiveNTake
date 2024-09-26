import styled from 'styled-components'
import ProfileImg from '../../assets/images/profile-img.jpeg'

export default function Contact({
  contactIdObj,
  isSelected,
  onContactSelect,
  contactImg,
  title,
  message = '',
  date,
  isSelfRead
}) {
  return (
    <$ListItem className={`${isSelected ? 'selected' : ''}`} onClick={() => onContactSelect(contactIdObj)}>
      <div className="profile-img">
        <img className="rounded-full" src={contactImg || ProfileImg} alt="Profile Pic" />
      </div>
      <div className="details">
        <div className="top">
          <p className="title">{title}</p>
          <p className="date">{date}</p>
        </div>
        <p className="msg-preview">{message}</p>
        {!isSelfRead && <span className="newMsgIndicator"></span>}
      </div>
    </$ListItem>
  )
}

const $ListItem = styled.li`
  position: relative;
  height: 5em;
  display: flex;
  gap: 0.5em;
  overflow: hidden;
  padding: 0.4em;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  .newMsgIndicator {
    width: 1em;
    height: 1em;
    border-radius: 1em;
    background-color: #16bed7;
    flex-shrink: 0;
    position: absolute;
    right: 0.6em;
    bottom: 0.6em;
  }
  &.selected {
    border-left: #637084 0.3em solid;
    background-color: #f6f6f6;
  }
  .profile-img {
    padding: 0.3em;
    flex-shrink: 0;
    position: relative;

    img {
      max-height: 100%;
      width: auto;
      aspect-ratio: 1;
      object-fit: cover;
    }
  }
  .details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 5em);
    flex: 1;

    .top {
      display: flex;
      justify-content: space-between;

      .title {
        font-weight: 600;
      }
      .date {
        color: var(--secondary-font-color);
        font-size: 0.8em;
      }
    }

    .msg-preview {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.9em;
      white-space: nowrap;
      font-size: 0.85em;
      font-weight: 300;

      @supports (-webkit-line-clamp: 2) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: initial;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
`
