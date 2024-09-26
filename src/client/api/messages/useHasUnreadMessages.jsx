import { useEffect, useState } from 'react'
import { useUser } from '../users/useUser'
import { useContacts } from './useContacts'

const useHasUnreadMessages = () => {
  const { isLoggedIn } = useUser()
  const { data: contacts } = useContacts({ enabled: isLoggedIn })

  const numUnreadConversations = contacts?.reduce((count, contact) => {
    if (!contact.isSelfRead) return count + 1
    return count
  }, 0)

  return numUnreadConversations || 0
}
export default useHasUnreadMessages
