import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from 'notistack';
import useAxiosPrivate from '../useAxiosPrivate';


export const useCreateReview = () => {
    const axiosPrivate = useAxiosPrivate();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: async ({data}) => {
            console.log(data);
            return await axiosPrivate.put('/reviews', data)
        },

        onSuccess: ({ data }, { closeModal }) => {
            closeModal();
            enqueueSnackbar("Review has been created.", { variant: 'success' });
        },

        onError: (error) => {
            let errMsg = 'Error on Review creation. Please try again!';
            enqueueSnackbar(errMsg, { variant: 'error' });
        }
    })
};