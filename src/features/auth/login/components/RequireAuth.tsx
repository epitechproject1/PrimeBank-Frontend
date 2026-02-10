import { Navigate, Outlet, useLocation } from "react-router-dom";
import {authTokens} from "../../../../lib/api_client/authTokens.ts";

export function RequireAuth() {
    const location = useLocation();

    // On vérifie si le token existe
    const token = authTokens.getAccess();

    if (!token) {
        // Pas de token ? Hop, direction Login.
        // On passe "state={{ from: location }}" pour savoir d'où il venait (utile pour rediriger après login)
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Token présent ? On affiche la route demandée (Outlet)
    return <Outlet />;
}