import { useMutation, useQueryClient } from '@tanstack/react-query'

const useOptimisticMutation = ({ mutationFn, optimistic, onSuccess, onError }) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onMutate: async variables => {
      const results = []

      try {
        const handlers = optimistic(variables)

        for (const handler of handlers) {
          if ('queryKey' in handler) {
            const { queryKey, updater } = handler
            if (!updater) continue
            let didCancelFetch = false

            // If query is currently fetching, we cancel it to avoid overwriting our optimistic update.
            // This would happen if query responds with old data after our optimistic update is applied.
            const isFetching = queryClient.getQueryState(queryKey)?.fetchStatus === 'fetching'
            if (isFetching) {
              await queryClient.cancelQueries(queryKey)
              didCancelFetch = true
            }

            // Get previous data before optimistic update
            const previousData = queryClient.getQueryData(queryKey)
            // Rollback function we call if mutation fails
            const rollback = () => queryClient.setQueryData(queryKey, previousData)
            // Invalidate function to call after mutation is done if we cancelled a fetch.
            // This ensures that we get both the optimistic update and fresh data from the server.
            const invalidate = () => queryClient.invalidateQueries(queryKey)

            // Update data in React Query cache
            queryClient.setQueryData(queryKey, updater)

            // Add to results that we read in onError and onSettled
            results.push({
              rollback,
              invalidate,
              didCancelFetch
            })
          } else {
            // If no query key then we're not operating on the React Query cache
            // We expect to have a `getData` and `setData` function
            const { getData, setData, updater } = handler
            const previousData = getData()
            const rollback = () => setData(previousData)
            setData(updater)
            results.push({
              rollback
            })
          }
        }
      } catch (error) {
        console.log(error)
        throw error
      }
      return { results }
    },
    // On error revert all queries to their previous data
    onError: (error, variables, context) => {
      console.log(error)
      if (context?.results) {
        context.results.forEach(({ rollback }) => {
          rollback()
        })
      }

      onError?.(error, variables, context)
    },
    // also if there is more data that should be returned and updated after success update it also in cache.
    onSuccess: (data, variables, context) => {
      const handlers = optimistic(variables)

      for (const handler of handlers) {
        if ('queryKey' in handler) {
          const { queryKey, updateReturnedData } = handler

          if (updateReturnedData) {
            queryClient.setQueryData(queryKey, prev => ({ ...prev, ...data }))
          }
        }
      }

      onSuccess?.(data, variables, context)
    },
    // When mutation is done invalidate cancelled queries so they get refetched
    onSettled: (data, error, variables, context) => {
      if (context?.results) {
        context.results.forEach(({ didCancelFetch, invalidate }) => {
          if (didCancelFetch && invalidate) {
            invalidate()
          }
        })
      }
    }
  })
}

export default useOptimisticMutation
