import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getFormData } from '../../utils/lib'
import useAxiosPrivate from '../useAxiosPrivate'
import { enqueueSnackbar } from 'notistack'
import { QUERY_KEY } from '../constants'

export const useUserUpdate = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ data }) => {
      console.log('mutationFn', data)
      const formData = getFormData(data, 'img')

      return await axiosPrivate.patch('/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    onMutate: async ({ data }) => {
      const dataClone = { ...data }
      delete dataClone.img

      dataClone.location.geometry = {
        type: 'Point',
        coordinates: [+dataClone.location.lat, +dataClone.location.long]
      }

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData([QUERY_KEY.user])

      // Optimistically update
      queryClient.setQueryData([QUERY_KEY.user], prev => ({ ...prev, ...dataClone }))

      // Return a context object with the snapshotted value
      return { previousUser }
    },
    // specificaly here we need to get back the img Url.
    onSuccess: ({ data }, { onSuccess }) => {
      queryClient.setQueryData([QUERY_KEY.user], prev => ({ ...prev, ...data }))

      onSuccess?.()
      enqueueSnackbar('User has been updated successfully.', { variant: 'success' })
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newUser, context) => {
      console.log(err)
      queryClient.setQueryData([QUERY_KEY.user], context.previousUser)
      enqueueSnackbar('User not updated. Error occured', { variant: 'error' })
    }
  })
}

export default useUserUpdate
