import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../../api/auth/useRefreshToken';
import { useUser } from "../../api/users/useUser";
import { Spinner } from "flowbite-react";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { mutateAsync: refreshToken } = useRefreshToken();
    const { isLoggedIn } = useUser();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refreshToken()
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }
        // console.log("refresh: ", !user?.accessToken)
        !isLoggedIn ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

    return (
        <>
            {isLoading
                ? 
                <div style={{display:'flex', justifyContent: 'center'}}>
                    <Spinner aria-label="Extra large spinner example" size="xl" style={{ margin: 'auto' }} />
                </div>

                : <Outlet />
            }
        </>
    )
}

export default PersistLogin;