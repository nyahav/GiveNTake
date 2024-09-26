import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { QUERY_KEY } from '../constants'
import useAxiosPrivate from '../useAxiosPrivate'
import { isObjectEmpty } from '../../utils/lib'

export const usePosts = ({ filters = {}, enabled } = {}) => {
  const { enqueueSnackbar } = useSnackbar()
  const axiosPrivate = useAxiosPrivate()
  const filtersKeys = isObjectEmpty(filters) ? [] : [filters]

  return useQuery({
    queryKey: [QUERY_KEY.posts, ...filtersKeys],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/posts', { params: { filters } })
      return data
    },
    onError: err => {
      let errMessage = err.message || 'Something went wrong. Please try again!'
      enqueueSnackbar(errMessage, { variant: 'error' })
    },
    enabled: enabled ?? true
  })
}

export const usePaginatedPosts = ({ filters = {}, enabled } = {}) => {
  const axiosPrivate = useAxiosPrivate()
  const filtersKeys = isObjectEmpty(filters) ? [] : [filters]

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.posts, ...filtersKeys],
    queryFn: async ({ pageParam }) => {
      const { data } = await axiosPrivate.get('/posts', { params: { filters, cursor: pageParam } })
      return data
    },
    getNextPageParam: (lastPage, pages) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    initialPageParam: 1,
    enabled: enabled ?? true
  })
}
