import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../constants";
import { useSnackbar } from "notistack";
import useAxiosPrivate from "../useAxiosPrivate";
import { isObjectEmpty } from "../../utils/lib";

const useUsers = ({ filters = {}, enabled }) => {
    const { enqueueSnackbar } = useSnackbar();
    const axiosPrivate = useAxiosPrivate();
    const filtersKeys = isObjectEmpty(filters) ? [] : [filters];

  return useQuery({
    queryKey: [QUERY_KEY.search, QUERY_KEY.user, ...(filtersKeys)],
    queryFn: async () => {
        const { data } = await axiosPrivate.get('/users/search', { params: { filters } })
        return data
    },
    onError: (err) => {
        let errMessage = err.message || 'Something went wrong. Please try again!';
        enqueueSnackbar(errMessage, { variant: 'error' });
    },
    initialData: [],
    enabled: enabled ?? true
  });
};
export default useUsers;
