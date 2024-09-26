import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import useAxiosPrivate from '../useAxiosPrivate'
import { getFormData } from '../../utils/lib'
import { QUERY_KEY } from '../constants'

export const useUpdatePost = () => {
  const axiosPrivate = useAxiosPrivate()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ data }) => {
      const formData = getFormData(data, 'img')

      return await axiosPrivate.patch('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    onSuccess: () => {
      enqueueSnackbar('Post updated successfully', { variant: 'success' })
      queryClient.invalidateQueries(QUERY_KEY.posts)
    },
    onError: error => {
      error = error.response.data
      if (error.statusCode === 500) error.message = 'Error on post update. Please try again!'

      enqueueSnackbar(error.message, { variant: error.variant })
    }
  })
}
