import useAxiosPrivate from '../useAxiosPrivate'
import { QUERY_KEY } from '../constants'
import useOptimisticMutation from '../../hooks/useOptimisticMutation'
import { v4 as uuidv4 } from 'uuid'
import { useQueryClient } from '@tanstack/react-query'

export const useSendMessage = ({ selfUserId }) => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useOptimisticMutation({
    mutationFn: async ({ contact, message } = variables) => {
      const { data } = await axiosPrivate.post('/messages', { contact, message })
      return data
    },
    optimistic: ({ contact, message, to, socket } = variables) => {
      return [
        {
          queryKey: [QUERY_KEY.conversations, contact],
          updater: currentData => {
            //if conversation is NOT new then send message immidiatly
            if (contact?.conversationId) {
              socket.current.emit('send-msg', {
                to,
                from: selfUserId,
                conversationId: contact?.conversationId,
                message
              })
            }

            const uniqueId = uuidv4()
            const newMessage = {
              _id: uniqueId,
              conversation: contact?.conversationId,
              sender: selfUserId,
              createdAt: new Date(),
              body: {
                text: message
              },
              fromSelf: true
            }

            const result = {
              ...currentData,
              messages: [...(currentData?.messages ?? []), newMessage]
            }

            return result
          }
        },
        {
          queryKey: [QUERY_KEY.conversations],
          updater: currentData => {
            if (!contact.conversationId) return
            const foundConversationIndex = currentData.findIndex(
              currContact => currContact.conversationId === contact.conversationId
            )
            const newData = [...currentData]
            newData[foundConversationIndex].isSelfRead = true
            newData[foundConversationIndex].lastMessage.body.text = message
            newData[foundConversationIndex].lastMessage.createdAt = new Date()
            newData[foundConversationIndex].lastMessage.fromSelf = null

            return newData
          }
        }
      ]
    },
    onSuccess: (data, { contact, socket, message }, context) => {
      if (!contact?.conversationId) {
        queryClient.invalidateQueries(QUERY_KEY.conversations)

        //if conversation is NEW then send message after got a conversationId (only after conversation has been created in the db)
        if (data?.conversation) {
          // console.log('returnedDataMsgSend', data.conversation)

          socket.current.emit('send-msg', {
            to: data.conversation.otherUsers,
            from: selfUserId,
            conversationId: data.conversation.conversationId,
            message,
            isNew: true
          })
        }
      }
    }
  })
}
