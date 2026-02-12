import { LoginPayload, LoginResponse } from "../types/login.types.ts";
import { apiClient } from "../../../../lib/api_client/apiClient.ts";
import { authTokens } from "../../../../lib/api_client/authTokens.ts";

/**
 * Connecte l'utilisateur et stocke les tokens
 */
export async function login(payload: LoginPayload) {
    const { data } = await apiClient.post<LoginResponse>(
        "/auth/login/",
        payload
    );

    // On sauvegarde les tokens dès la réponse API
    authTokens.setTokens(data.access_token, data.refresh_token);

    return data;
}

/**
 * Déconnecte l'utilisateur côté serveur (Blacklist du token)
 * Note : Le nettoyage du localStorage se fait dans le hook useLogout
 */
export async function logout() {
    const refresh = authTokens.getRefresh();

    // Si pas de refresh token, on ne fait rien (l'utilisateur est déjà "logiquement" déconnecté)
    if (!refresh) {
        return;
    }

    // On envoie le refresh token au backend pour l'invalider
    await apiClient.post("/auth/logout/", {
        refresh
    });
}