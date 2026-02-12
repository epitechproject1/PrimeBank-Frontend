import { Navigate, Outlet } from "react-router-dom";
import {authTokens} from "../../../../lib/api_client/authTokens.ts";

export function PublicOnlyRoute() {
    const token = authTokens.getAccess();

    if (token) {
        // Si déjà connecté, on renvoie au dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}