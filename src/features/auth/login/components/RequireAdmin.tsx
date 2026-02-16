import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userStorage } from "../../../../lib/storage/userStorage";
import { isAdminRole } from "../../../../lib/auth/role";
import { getMe } from "../../../users/services/user.service";
import { Spin } from "antd";

export function RequireAdmin() {
    const location = useLocation();
    const cachedUser = userStorage.getUser();

    const shouldFetch = !cachedUser?.role;
    const { data, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        enabled: shouldFetch,
    });

    const user = cachedUser?.role ? cachedUser : data || null;
    if (data && !cachedUser?.role) {
        userStorage.setUser(data);
    }

    if (isLoading) {
        return <Spin style={{ margin: 24 }} />;
    }

    if (!user || !isAdminRole(user.role)) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
