import useOptimisticMutation from '../../hooks/useOptimisticMutation'
import { QUERY_KEY } from '../constants'
import useAxiosPrivate from '../useAxiosPrivate'

const useReadConversation = () => {
  const axiosPrivate = useAxiosPrivate()

  return useOptimisticMutation({
    mutationFn: async ({ conversationId } = variables) => {
      return axiosPrivate.post('/messages/read-conversation', { conversationId }).then(res => res.data)
    },
    optimistic: ({ conversationId } = variables) => {
      return [
        {
          queryKey: [QUERY_KEY.conversations],
          updater: currentData => {
            const updatedConversations = currentData.map(conversation => {
              if (conversation.conversationId === conversationId) {
                return {
                  ...conversation,
                  isSelfRead: true
                }
              } else {
                return conversation
              }
            })

            return updatedConversations
          }
        }
      ]
    }
  })
}

export default useReadConversation
