import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '../constants'
import useAxiosPrivate from '../useAxiosPrivate'

export const useReportedPosts = () => {
  const axiosPrivate = useAxiosPrivate()

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.posts, QUERY_KEY.reports],
    queryFn: async ({ pageParam }) => {
      const { data } = await axiosPrivate.get('/editor/reported-posts', { params: { cursor: pageParam } })
      return data
    },
    getNextPageParam: (lastPage, pages) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    initialPageParam: 1
  })
}
