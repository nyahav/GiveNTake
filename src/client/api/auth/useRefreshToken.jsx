import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';
import { QUERY_KEY } from '../constants';

const refreshToken = async () => await axios.get('/auth/refresh', { withCredentials: true });

const useRefreshToken = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: refreshToken,
        onSuccess: ({data}) => {
            queryClient.setQueryData([QUERY_KEY.user], prev => ({ ...prev, ...data }));
        },
        onError: (err) => {}
    });
};

export default useRefreshToken;