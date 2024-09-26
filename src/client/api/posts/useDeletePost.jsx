import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'
import { enqueueSnackbar } from 'notistack'

const useDeletePost = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId }) => {
      return (await axiosPrivate.delete('/posts', { params: { postId } })).data
    },
    onSuccess: () => {
      enqueueSnackbar('Post has been deleted successfully', { variant: 'success' })
      queryClient.invalidateQueries(QUERY_KEY.posts)
    },
    onError: error => {
      error = error.response.data
      if (error.statusCode === 500) error.message = 'Error on post delete. Please try again!'

      enqueueSnackbar(error.message, { variant: error.variant })
    }
  })
}

export default useDeletePost
