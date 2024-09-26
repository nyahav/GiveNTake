import { useQueryClient } from "@tanstack/react-query";

const useOptimisticMutation = ({ queryKey, updaterFn, successMessage }) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();


  return {
    onMutate: async ({ newData }) => {  // updater ex. (old) => [...old, newData] OR (old) => ({...old, newData})   
      await queryClient.cancelQueries(queryKey);

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (currentData) => updaterFn(currentData, newData));

      if(successMessage) enqueueSnackbar(successMessage, { variant: 'success' });

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (_, __, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(queryKey, context.previousData);

      let errMessage = err.message || 'Something went wrong. Please try again!';
      enqueueSnackbar(errMessage, { variant: 'error' });
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  };

};

export default useOptimisticMutation;