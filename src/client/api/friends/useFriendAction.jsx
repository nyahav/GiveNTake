import useAxiosPrivate from '../useAxiosPrivate';
import { QUERY_KEY } from "../constants";
import useOptimisticMutation from "../../hooks/useOptimisticMutation";
import { useUser } from '../users/useUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isObjectEmpty } from '../../utils/lib';


export const useFriendAction = () => {
    const axiosPrivate = useAxiosPrivate();
    const { data: authUser } = useUser();
    const auth_userId = authUser._id;

    return useOptimisticMutation({
        mutationFn: async (variables) => {
            console.log(variables);
            const { data } = await axiosPrivate.post('/friends/action', variables);
            return data;
        },
        optimistic: ({ toUser, actions } = variables) => {
            return [
                {
                    queryKey: [QUERY_KEY.friends, auth_userId], // first updates the authenticated user friends
                    updater: (currentData) => {

                        if ('follow' in actions) {   // 'auth_userId' started follow 'toUser'
                            return {
                                ...currentData,
                                following: [
                                    ...(currentData?.following || []),
                                    toUser
                                ]
                            }
                        } else if ('unfollow' in actions) {   // 'auth_userId' unfollowed 'toUser'
                            return {
                                ...currentData,
                                following: currentData?.following?.filter((item) => item._id !== toUser)
                            }
                        } else if ('remove' in actions) {
                            return {
                                ...currentData,
                                followers: currentData?.followers?.filter((item) => item._id !== toUser),
                            }
                        }
                    }
                },
                {
                    queryKey: [QUERY_KEY.friends, toUser],// updates the other user that has been affected
                    updater: (currentData) => {

                        if ('follow' in actions) {   // 'auth_userId' started follow 'toUser'
                            return {
                                ...currentData,
                                followers: [
                                    ...(currentData?.followers || []),
                                    {
                                        _id: auth_userId,
                                        firstName: authUser.firstName,
                                        lastName: authUser.lastName,
                                        imgUrl: authUser.imgUrl
                                    }
                                ],
                                isAuthUserIsFollowing: true
                            }
                        } else if ('unfollow' in actions) {   // 'auth_userId' unfollowed 'toUser'
                            return {
                                ...currentData,
                                followers: currentData?.followers?.filter((item) => item._id !== auth_userId),
                                isAuthUserIsFollowing: false
                            }
                        } else if ('remove' in actions) {
                            return {
                                ...currentData,
                                following: currentData?.following?.filter((item) => item._id !== auth_userId)
                            }
                        }

                    }
                },
            ];
        }
    });
};