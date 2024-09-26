import styled from 'styled-components'
import { useState } from 'react'
import Contact from './Contact'
import { getRelativeTime } from '../../utils/lib'
import md5 from 'md5'

const TABS = {
  All: 'All',
  Open: 'Open',
  Closed: 'Closed'
}

export default function ContactSelector({ contacts, selectedContact, onContactSelect }) {
  const [selectedTab, setSelectedTab] = useState(TABS.All)

  const changeContact = contactIdObj => {
    onContactSelect(contactIdObj)
  }

  const contactsList = (
    <ul>
      {contacts?.map(contact => {
        let isSelected = false
        if (selectedContact?.user) {
          isSelected = selectedContact?.userId === contact.user._id
        } else {
          isSelected = selectedContact?.conversationId === contact.conversationId
        }

        let contactIdObj, title, message, date, contactImg, isSelfRead
        if (contact?.user) {
          contactIdObj = { userId: contact.user._id }
          title = contact.user ? contact.user.firstName + ' ' + contact.user.lastName : 'Deleted user'
          message = ''
          contactImg = contact.user?.imgUrl
          isSelfRead = true
        } else if (contact?.conversationId && contact?.post) {
          contactIdObj = { conversationId: contact.conversationId }
          title = (contact.otherUsers[0]?.firstName || 'Deleted user') + ' • ' + (contact.post?.title ?? 'Deleted post')
          message = contact.lastMessage.body?.text
          contactImg = contact.post?.imgUrl || contact.otherUsers[0]?.imgUrl
          isSelfRead = contact.isSelfRead
        } else if (contact?.conversationId) {
          contactIdObj = { conversationId: contact.conversationId }
          title = contact.otherUsers[0]
            ? contact.otherUsers[0].firstName + ' ' + contact.otherUsers[0].lastName
            : 'Deleted user'
          message = contact.lastMessage.body?.text
          date = getRelativeTime(contact.lastMessage.createdAt)
          contactImg = contact.otherUsers[0]?.imgUrl
          isSelfRead = contact.isSelfRead
        }

        const key = md5(JSON.stringify(contactIdObj))

        return (
          <Contact
            key={key}
            {...{ contactIdObj, contactImg, message, title, date, isSelected, isSelfRead }}
            onContactSelect={changeContact}
          />
        )
      })}
    </ul>
  )

  return (
    <$Wrapper>
      {/* <$Tabs>
            {Object.keys(TABS).map((currTab) =>
                <$TabItem key={currTab} $isActive={selectedTab === currTab} onClick={() => setSelectedTab(currTab)}>{currTab}</$TabItem>
            )}
        </$Tabs> */}
      <div className="list">{contactsList}</div>
    </$Wrapper>
  )
}

const $Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  .list {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 100%;
    border-right: 1px solid #ddd;

    p {
      margin: 0;
      padding: 0;
    }
  }
`

const $Tabs = styled.div`
  border-bottom: 0.1em solid #eee;
  height: fit-content;
`

const $TabItem = styled.button`
  font-weight: 500;
  padding: 0.8em;
  border-bottom: 0.2em solid transparent;

  ${({ $isActive }) =>
    $isActive &&
    `
        border-bottom: .2em solid var(--third-color);
        color: var(--third-color);
    `}
  &:hover {
    color: var(--third-color);
  }
`
