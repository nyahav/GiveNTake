import axios from '../axios';
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from 'notistack';
import { QUERY_KEY } from '../constants';


const signUp = async (signupData) => {
    return await axios.post('/auth/signup', JSON.stringify(signupData), {
        headers: { 'Content-Type': 'application/json' },
    });
};


export const useSignUp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: (data) => signUp(data),
        onSuccess: ({data}) => {
            queryClient.setQueryData([QUERY_KEY.user], data) // save the user in the state            
            navigate(from, { replace: true });
        },
        onError: (error) => {
            let errMsg = 'Error on sign up. Try again!';
            switch (error?.request?.status) {
                case 409:
                    errMsg = "User already exists."; break;
                case 401: 
                errMsg = "Wrong verification code."; break;
            }
            console.log('error: ', errMsg);
            enqueueSnackbar(errMsg, { variant: 'error' });
        }
    })
};