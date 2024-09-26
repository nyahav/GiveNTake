import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../axios";
import { QUERY_KEY } from "../constants";
import { useNavigate } from "react-router-dom";

const logout = async () => axios.post('/auth/logout', { withCredentials: true });

const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logout,
        onMutate: () => {
            queryClient.setQueryData([QUERY_KEY.user],{});
            navigate('/auth?mode=login')
        },
    });
}

export default useLogout;