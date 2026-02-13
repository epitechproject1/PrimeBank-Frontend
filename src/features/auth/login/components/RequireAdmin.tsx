import { Navigate, Outlet, useLocation } from "react-router-dom";
import { userStorage } from "../../../../lib/storage/userStorage";
import { isAdminRole } from "../../../../lib/auth/role";

export function RequireAdmin() {
    const location = useLocation();
    const user = userStorage.getUser();

    if (!user || !isAdminRole(user.role)) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
