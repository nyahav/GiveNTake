import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Messages.module.scss'
import ChatBox from '../components/Messages/ChatBox'
import { useUser } from '../api/users/useUser'
import { BASE_URL } from '../api/axios'
import { io } from 'socket.io-client'
import ContactSelector from '../components/Messages/ContactSelector'
import { useContacts } from '../api/messages/useContacts'
import { useLocation, useNavigate } from 'react-router-dom'
import { useConversation } from '../api/messages/useConversation'
import NoConversationsImg from '../assets/images/empty-states/no-contacts.svg'
import { useSendMessage } from '../api/messages/useSendMessage'
import { useReceiveMessage } from '../api/messages/useReceiveMessage'
import EmptyState from '../components/EmptyState'
import useReadConversation from '../api/messages/useReadConversation'

export default function Messages() {
  const { state: navigationState, pathname } = useLocation()
  const navigate = useNavigate()
  let isNavigated = true
  // const [navigationState, setNavigationState] = useState(state);

  const [firstContactsRender, setFirstContactsRender] = useState(true)
  const { selectedContactDirect, interestedInPost } = navigationState || {}

  const { data: user } = useUser()
  const socket = useRef()
  const [showChatBox, setShowChatBox] = useState(false)

  const [newContact, setNewContact] = useState()

  const { data: contacts } = useContacts()

  const [currentContact, setCurrentContact] = useState()
  const { data: conversation } = useConversation({
    conversationId: currentContact?.conversationId,
    enabled: !!currentContact?.conversationId
  })

  const { mutate: sendMessageMutation } = useSendMessage({
    selfUserId: user._id
  })
  const { mutate: receiveMessageMutation } = useReceiveMessage({
    selfUserId: user._id
  })
  const { mutate: readConversation } = useReadConversation()

  //set the first contact to be selected
  useEffect(() => {
    if (contacts && !selectedContactDirect && firstContactsRender) {
      setFirstContactsRender(false)

      setCurrentContact({
        conversationId: contacts?.[0]?.conversationId
      })
    }
  }, [contacts])

  // Handler: if got navigated to the messages page with a message action or interest action
  useEffect(() => {
    if (navigationState && isNavigated) {
      isNavigated = false
      if (selectedContactDirect && contacts) {
        //CASE: user is want to send message to specific user

        //look up for the requested contact in the contacts list
        const foundContact = contacts.find(contact => {
          const isAssociatedWithPost = !!contact?.post?._id
          const isSameUser = !!contact.otherUsers.find(user => user._id === selectedContactDirect.user._id)

          return !isAssociatedWithPost && isSameUser
        })

        if (foundContact) {
          // select this contact from existing contacts list
          setNewContact(null)
          setCurrentContact({
            conversationId: foundContact.conversationId
          })
        } else {
          // select this new contact and add it as a new contact
          setNewContact({ user: selectedContactDirect.user })
          setCurrentContact({
            userId: selectedContactDirect.user._id
          })
        }
      } else if (interestedInPost && contacts) {
        const interestedInPostTemp = interestedInPost
        navigate(pathname, { state: { interestedInPost: null } })
        //CASE: user is interested in post so send message to post owner

        //look up for the requested contact in the contacts list
        const foundContact = contacts.find(contact => {
          const isSamePost = contact.post?._id === interestedInPostTemp.postId
          const isSameUser = !!contact.otherUsers.find(user => user._id === interestedInPostTemp.userId)

          return isSamePost && isSameUser
        })

        let contact = {
          userId: interestedInPostTemp.userId,
          postId: interestedInPostTemp.postId
        }
        if (foundContact) {
          // select this contact from existing contacts list
          setNewContact(null)
          contact = {
            conversationId: foundContact.conversationId
          }
          setCurrentContact(contact)
        }

        sendMessage(interestedInPostTemp.message, contact)
      }
    }
  }, [navigationState, contacts])

  // if the user is online send to the server a poke message that this user is online and willing to get instant messages
  useEffect(() => {
    if (user) {
      socket.current = io(BASE_URL)
      socket.current.emit('add-user', user._id)
    }
  }, [user])

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recieve', packet => {
        receiveMessageMutation({
          conversationId: packet.conversationId,
          message: packet.message,
          from: packet.from,
          isNew: packet.isNew
        })
      })
    }
  }, [])

  const changeContactHandler = contactIdObj => {
    setCurrentContact(contactIdObj)
    setShowChatBox(true)
    if (contactIdObj?.conversationId) {
      readConversation({ conversationId: contactIdObj.conversationId })
    }
  }

  const sendMessage = (message, contact) => {
    sendMessageMutation({
      contact: currentContact || contact,
      to: conversation?.otherUsers.map(user => user._id),
      message,
      socket
    })
  }

  const allContacts = [...(newContact ? [newContact] : []), ...(contacts ?? [])]
  const newConversation = newContact
    ? {
        otherUsers: [newContact.user]
      }
    : null

  return (
    <>
      <div className={styles.chatPage}>
        <div className={styles.contactsWrap}>
          {allContacts?.length ? (
            <ContactSelector
              contacts={allContacts}
              selectedContact={currentContact}
              onContactSelect={changeContactHandler}
            />
          ) : (
            <EmptyState img={NoConversationsImg} title="No Conversations" />
          )}
        </div>
        <div className={`${styles.chatBox} ${showChatBox && styles.show}`}>
          <ChatBox
            {...{ socket, sendMessage }}
            selfUserId={user._id}
            conversation={conversation || newConversation}
            onClose={() => setShowChatBox(false)}
          />
        </div>
      </div>
    </>
  )
}
