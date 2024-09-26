import { useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'
import { enqueueSnackbar } from 'notistack'

const useBumpPost = () => {
  const axiosPrivate = useAxiosPrivate()

  return useMutation({
    mutationFn: async ({ postId }) => {
      return (await axiosPrivate.post('/posts/bump', { postId })).data
    },
    onSuccess: () => {
      enqueueSnackbar('Post bumped', { variant: 'success' })
    },
    onError: error => {
      error = error.response.data
      if (error.statusCode === 500) error.message = 'Error on post bump. Please try again!'

      enqueueSnackbar(error.message, { variant: error.variant })
    }
  })
}

export default useBumpPost
