
import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from 'notistack';
import { QUERY_KEY } from "../constants";
import useAxiosPrivate from "../useAxiosPrivate";
import { isObjectEmpty } from "../../utils/lib";

export const useReviews = ({ filters={}, enabled }={}) => {
    const { enqueueSnackbar } = useSnackbar();
    const axiosPrivate = useAxiosPrivate();
    const filtersKeys = isObjectEmpty(filters) ? [] : [filters];

    return useQuery({
        queryKey: [QUERY_KEY.reviews, ...(filtersKeys)],
        queryFn: async () => {
            const { data } = await axiosPrivate.get('/reviews', { params: { filters } });
            return data;
        },
        onError: (err) => {
            let errMessage = err.message || 'Something went wrong. Please try again!';
            enqueueSnackbar(errMessage, { variant: 'error' });
        },
        enabled: enabled ?? true
    })
};