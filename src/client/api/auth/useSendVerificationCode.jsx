import { useMutation } from "@tanstack/react-query"
import axios from "../axios"
import { useSnackbar } from "notistack";

const useSendVerificationCode = () => {
    const { enqueueSnackbar } = useSnackbar();


    return useMutation({
        mutationFn: async (email) => await axios.post('/auth/send-verification-code', email).then(res => res.data),
        onError: (error,{abort}) => {
            let errMsg = 'Error on sign up. change email.';
            switch (error?.request?.status) {
                case 409:
                    errMsg = "Email already exists."; 
                    abort()
                    break;
            }
            console.log('error: ', errMsg);
            enqueueSnackbar(errMsg, { variant: 'error' });
        }
    })
}

export default useSendVerificationCode