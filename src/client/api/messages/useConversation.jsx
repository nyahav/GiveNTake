import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { QUERY_KEY } from '../constants';
import useAxiosPrivate from '../useAxiosPrivate';

export const useConversation = ({ conversationId, enabled } = {}) => {
  const { enqueueSnackbar } = useSnackbar();
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: [QUERY_KEY.conversations, { conversationId }],
    queryFn: async () => {
      const { data } = await axiosPrivate.get('/messages', { params: { conversationId } });
      return data;
    },
    onError: (err) => {
      let errMessage = err.message || 'Something went wrong. Please try again!';
      enqueueSnackbar(errMessage, { variant: 'error' });
    },
    enabled: enabled ?? true,
    staleTime: 0
  });
};
