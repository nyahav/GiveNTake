import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from 'notistack';
import useAxiosPrivate from '../useAxiosPrivate';
import { getFormData } from "../../utils/lib";


export const useCreatePost = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: async (data) => {
            const formData = getFormData(data, 'img');

            return await axiosPrivate.put('/posts',formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })},

        onSuccess: ({data}) => {
            navigate('/');
            enqueueSnackbar('Post created successfully', { variant: 'info' });
        },

        onError: (error) => {
            let errMsg = 'Error on post creation. Please try again!';
            enqueueSnackbar(errMsg, { variant: 'error' });
        }
    })
};