import axios from '../axios';
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from 'notistack';
import { QUERY_KEY } from '../constants';

const login = async (loginData = { email, password, persist }) => {
    return await axios.post('/auth/login', JSON.stringify(loginData), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
    });
};


export const useLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        
        mutationFn: login,
        onSuccess: ({data}) => {
            queryClient.setQueryData([QUERY_KEY.user], prev => ({...prev, ...data })) // save the user in the state            
            navigate(from, { replace: true });
        },
        onError: (error) => {
            let errMsg = 'Error on login. Try again!';
            switch (error?.request?.status) {
                case 401:
                    errMsg = "Wrong email or password"; break;
            }
            enqueueSnackbar(errMsg, { variant: 'error' });
        }
    })
};