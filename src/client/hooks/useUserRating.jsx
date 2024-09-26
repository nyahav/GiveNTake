import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../api/axios.js';
import { QUERY_KEY } from '../api/constants.js';

export function useUserRating(userId) {

  const fetchRating = async () => {
    const response = await axios.get(`${API_URL}/users/rating`, { params: { userId } });
    return response.data.userRating;
  };

  return useQuery({
    queryKey: [QUERY_KEY.user, userId, 'rating'],
    queryFn: fetchRating,
    enabled: !!userId,
    retry: 2,
  });
}