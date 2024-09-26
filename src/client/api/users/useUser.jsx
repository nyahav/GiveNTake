import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '../constants'
import { axiosPrivate } from '../axios'
import { useSnackbar } from 'notistack'
import { jwtDecode } from 'jwt-decode'

// to get the authenticated user call useUser()
// to get a specific user call useUser({ userId })

export const useUser = ({ userId, enabled } = {}) => {
  const { enqueueSnackbar } = useSnackbar()

  const query = useQuery({
    queryKey: [QUERY_KEY.user, ...(userId ? [userId] : [])],
    ...(userId && {
      queryFn: async () => {
        const { data } = await axiosPrivate.get('/users', { params: { userId } })
        return data
      }
    }),

    onError: err => {
      let errMessage = err.message || 'Something went wrong. Please try again!'
      enqueueSnackbar(errMessage, { variant: 'error' })
    },
    refetchOnMount: userId ?? false,
    refetchOnWindowFocus: userId ?? false,
    refetchOnReconnect: userId ?? false,
    initialData: {},
    retry: false,
    enabled: enabled ?? true
  })
  const user = query.data

  const decoded = user?.accessToken ? jwtDecode(user.accessToken) : undefined
  const roles = decoded?.roles || []

  const isUserAuthorized = allowedRoles => {
    return !!roles.find(role => allowedRoles.includes(role))
  }

  return {
    ...query,
    ...(userId ? {} : { isLoggedIn: !!user?.accessToken || false }),
    roles,
    isUserAuthorized
  }
}
