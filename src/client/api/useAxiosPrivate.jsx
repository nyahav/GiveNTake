import { axiosPrivate } from "./axios";
import { useEffect } from "react";
import useRefreshToken from "./auth/useRefreshToken";
import { useUser } from "./users/useUser";

const useAxiosPrivate = () => {
    const { mutate: refreshToken } = useRefreshToken();
    const { data: user, isLoggedIn } = useUser();

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                if (isLoggedIn && !config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${user?.accessToken}`;
                }

                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;

                    refreshToken();
                    prevRequest.headers['Authorization'] = `Bearer ${user?.accessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [user, user?.accessToken])

    return axiosPrivate;
}

export default useAxiosPrivate;