import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

// Types
import { LoginPayload, LoginResponse } from "../types/login.types";
import { ApiError } from "../../../../lib/api_client/apiError";

// Services (API)
// Assure-toi que le chemin pointe bien vers ton nouveau fichier regroupé
import { getMe } from "../../../users/services/user.service";

// Storage
import { userStorage } from "../../../../lib/storage/userStorage";
import { authTokens } from "../../../../lib/api_client/authTokens";
import {login, logout} from "../services/auth.service.ts";

export function useAuth() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();

    // =========================================================================
    // 1. LOGIQUE DE CONNEXION (LOGIN)
    // =========================================================================
    const loginMutation = useMutation<LoginResponse, ApiError, LoginPayload>({
        mutationFn: async (payload) => {
            // A. Appel API Login (les tokens sont stockés dans le service API)
            const loginData = await login(payload);

            // B. Récupération immédiate du profil utilisateur
            try {
                const userData = await getMe();
                userStorage.setUser(userData);
            } catch (error) {
                console.error("Impossible de récupérer le profil utilisateur", error);
                // On ne bloque pas le login, mais l'utilisateur n'aura pas son nom affiché
            }

            return loginData;
        },
        onSuccess: () => {
            messageApi.success("Connexion réussie");
            // Note : La redirection vers /dashboard est gérée dans le composant LoginForm
            // via le await login(data)
        },
        onError: () => {
            messageApi.error("Identifiants incorrects ou erreur serveur");
        },
    });

    // =========================================================================
    // 2. LOGIQUE DE DÉCONNEXION (LOGOUT)
    // =========================================================================
    const logoutMutation = useMutation({
        mutationFn: logout,
        // onSettled est CRUCIAL : il s'exécute que l'API réussisse ou échoue.
        // Cela garantit que l'utilisateur est bien déconnecté visuellement.
        onSettled: () => {
            // A. Nettoyage local
            authTokens.clear();
            userStorage.clearUser();

            // B. Nettoyage du cache React Query (évite de voir les données du précédent user)
            queryClient.clear();

            // C. Feedback et Redirection
            messageApi.info("Vous avez été déconnecté");
            navigate("/login", { replace: true });
        },
    });

    return {
        // --- LOGIN EXPORTS ---
        login: loginMutation.mutateAsync, // Async pour permettre le await dans le form
        isLoginLoading: loginMutation.isPending,
        loginError: loginMutation.error,

        // --- LOGOUT EXPORTS ---
        logout: logoutMutation.mutate,    // Pas besoin d'async, le hook gère la redirection
        isLogoutLoading: logoutMutation.isPending,

        // --- UTILS ---
        contextHolder, // Nécessaire pour afficher les messages Ant Design
    };
}