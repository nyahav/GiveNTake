import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../api/users/useUser";
import { jwtDecode } from "jwt-decode";

const RequireAuth = ({ allowedRoles }) => {
    const { data: user, isLoggedIn } = useUser();
    const location = useLocation();

    const decoded = user?.accessToken ? jwtDecode(user.accessToken) : undefined;
    const roles = decoded?.roles || [];

    return (
        roles.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : isLoggedIn //changed from user to accessToken to persist login after refresh
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/auth?mode=login" state={{ from: location }} replace />
    );
}

export default RequireAuth;