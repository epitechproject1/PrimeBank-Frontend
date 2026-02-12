import { apiClient } from "../../../lib/api_client/apiClient.ts";
import { User, CreateUserDTO, UpdateUserDTO, UserProfile } from "../types/user.type.ts";

export async function getMe() {
    // Note: L'URL doit correspondre a celle de ton ViewSet ('users/me/')
    const { data } = await apiClient.get<UserProfile>("/users/me/");
    return data;
}

function normalizeRole<T extends { role?: string }>(payload: T): T {
    if (!payload.role) return payload;
    return { ...payload, role: payload.role.toUpperCase() };
}

export const userService = {
    /**
     * GET /users/
     * Recupere tous les utilisateurs
     */
    getAll: async (): Promise<User[]> => {
        const { data } = await apiClient.get<User[]>("/users/");
        return data;
    },

    /**
     * GET /users/{id}/
     * Recupere un utilisateur par son ID
     */
    getById: async (id: string): Promise<User> => {
        const { data } = await apiClient.get<User>(`/users/${id}/`);
        return data;
    },

    /**
     * POST /users/
     * Cree un nouvel utilisateur
     */
    create: async (payload: CreateUserDTO): Promise<User> => {
        const { data } = await apiClient.post<User>("/users/", normalizeRole(payload));
        return data;
    },

    /**
     * PUT /users/{id}/
     * Met a jour un utilisateur
     */
    update: async (id: string, payload: UpdateUserDTO): Promise<User> => {
        const { data } = await apiClient.put<User>(`/users/${id}/`, normalizeRole(payload));
        return data;
    },

    /**
     * DELETE /users/{id}/
     * Supprime un utilisateur
     */
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/users/${id}/`);
    },

    /**
     * PATCH /users/{id}/toggle_status/
     * Active/Desactive un utilisateur
     */
    toggleStatus: async (id: string, is_active: boolean): Promise<User> => {
        const { data } = await apiClient.patch<User>(`/users/${id}/toggle_status/`, { is_active });
        return data;
    },
};
