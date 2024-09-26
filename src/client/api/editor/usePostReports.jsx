import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '../constants'
import useAxiosPrivate from '../useAxiosPrivate'

export const usePostReports = ({ postId, enabled }) => {
  const axiosPrivate = useAxiosPrivate()

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.posts, QUERY_KEY.reports, { postId }],
    queryFn: async ({ pageParam }) => {
      const { data } = await axiosPrivate.get('/editor/post-reports', { params: { cursor: pageParam, postId } })
      return data
    },
    getNextPageParam: (lastPage, pages) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    initialPageParam: 1,
    enabled: enabled ?? true
  })
}
