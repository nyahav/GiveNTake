import { QUERY_KEY } from '../constants'
import useOptimisticMutation from '../../hooks/useOptimisticMutation'
import { v4 as uuidv4 } from 'uuid'
import { useQueryClient } from '@tanstack/react-query'

export const useReceiveMessage = ({ selfUserId }) => {
  const queryClient = useQueryClient()

  return useOptimisticMutation({
    mutationFn: () => {},
    optimistic: ({ conversationId, from, message, isNew } = variables) => {
      return [
        {
          queryKey: [QUERY_KEY.conversations, { conversationId }],
          updater: currentData => {
            if (isNew) {
              //if conversation is NEW
              console.log('new chat')
              queryClient.invalidateQueries(QUERY_KEY.conversations)
              return {}
            } else {
              //if conversation is already exists in the contact list
              const uniqueId = uuidv4()
              const newMessage = {
                _id: uniqueId,
                conversation: conversationId,
                sender: from,
                createdAt: new Date(),
                body: {
                  text: message
                },
                fromSelf: false
              }

              const result = {
                ...currentData,
                messages: [...(currentData?.messages ?? []), newMessage]
              }

              return result
            }
          }
        },
        {
          queryKey: [QUERY_KEY.conversations],
          updater: currentData => {
            if (isNew) return
            const foundConversationIndex = currentData.findIndex(
              currContact => currContact.conversationId === conversationId
            )
            const newData = [...currentData]
            newData[foundConversationIndex].isSelfRead = false
            newData[foundConversationIndex].lastMessage.body.text = message
            newData[foundConversationIndex].lastMessage.createdAt = new Date()
            newData[foundConversationIndex].lastMessage.fromSelf = null

            return newData
          }
        }
      ]
    }
  })
}
