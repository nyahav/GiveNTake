import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import useAxiosPrivate from '../useAxiosPrivate'
import { QUERY_KEY } from '../constants'
import { isObjectEmpty } from '../../utils/lib'
import { produce } from 'immer'
import useOptimisticMutation from '../../hooks/useOptimisticMutation'

// ### EXAMPLE:
// data = {
//     postId: ObjectId,
//     actions: {
//         isSavedByUser: Boolean,
//         isUserInterested: Boolean,
//         isUserReported: Boolean
//         report: {
//              key: Enum REPORTS_KEYS,
//              description: String
//     }
// };

export const usePostAction = ({ filters = {} } = {}) => {
  const axiosPrivate = useAxiosPrivate()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const filtersKeys = isObjectEmpty(filters) ? [] : [filters]

  return useOptimisticMutation({
    mutationFn: async data => {
      return await axiosPrivate.post('/posts/action', data)
    },
    optimistic: ({ postId, actions }) => {
      return [
        {
          queryKey: [QUERY_KEY.posts, ...filtersKeys],
          updater: currentData => {
            return produce(currentData, draft => {
              draft.pages.forEach(page => {
                page.docs.forEach(post => {
                  if (post._id === postId) {
                    if (actions.hasOwnProperty('isSavedByUser')) {
                      post.isSavedByUser = actions.isSavedByUser
                    } else if (actions.hasOwnProperty('isUserInterested')) {
                      post.isUserInterested = actions.isUserInterested
                    } else if (actions.hasOwnProperty('isUserReported')) {
                      post.isUserReported = actions.isUserReported
                    }
                  }
                })
              })
            })
          }
        }
      ]
    },
    onSuccess: (_, { actions }) => {
      if (actions.hasOwnProperty('isSavedByUser')) {
        queryClient.refetchQueries([QUERY_KEY.posts, { onlySavedPosts: 1 }])
      }
      if (actions.hasOwnProperty('isUserReported')) enqueueSnackbar('Report sent.', { variant: 'success' })
    },
    onError: error => {
      console.log(error)
      let errMsg = 'Error on post action. Please try again!'
      enqueueSnackbar(errMsg, { variant: 'error' })
    }
  })
}
