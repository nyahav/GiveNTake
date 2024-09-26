import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import useAxiosPrivate from '../useAxiosPrivate'
import { QUERY_KEY } from '../constants'

const useSetPostAsOk = ({ postId }) => {
  const axiosPrivate = useAxiosPrivate()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = axiosPrivate.post('/editor/set-post-as-ok', { postId })
      return data
    },
    onSuccess: () => {
      enqueueSnackbar('Post was set as Ok', { variant: 'success' })
      queryClient.invalidateQueries([QUERY_KEY.posts, QUERY_KEY.reports, { postId }])
    },
    onError: error => {
      error = error.response.data
      if (error.statusCode === 500) error.message = 'Error on post action. Please try again!'

      enqueueSnackbar(error.message, { variant: error.variant })
    }
  })
}

export default useSetPostAsOk
