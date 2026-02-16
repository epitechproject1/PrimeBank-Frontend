import { apiClient } from "../../../lib/api_client/apiClient";
import { userStorage } from "../../../lib/storage/userStorage";
import type { User } from "../../users/types/user.type";

function getCurrentUserId(): number | null {
    const user = userStorage.getUser();
    return user?.id ?? null;
}

function buildUpdatePayload(payload: Partial<User>) {
    return {
        first_name: payload.first_name,
        last_name: payload.last_name,
        phone_number: payload.phone_number,
    };
}

async function patchMe(payload: Partial<User>) {
    return apiClient.patch("/users/me/", buildUpdatePayload(payload));
}

async function deleteMe() {
    return apiClient.delete("/users/me/");
}

export const profileService = {
    me: async (): Promise<User> => {
        const { data } = await apiClient.get("/users/me/");
        return data;
    },

    update: async (payload: Partial<User>) => {
        try {
            const { data } = await patchMe(payload);
            return data;
        } catch (error) {
            const id = getCurrentUserId();
            if (!id) throw error;
            const { data } = await apiClient.patch(`/users/${id}/`, buildUpdatePayload(payload));
            return data;
        }
    },

    changePassword: async (payload: { old_password: string; new_password: string }) => {
        await apiClient.post("/users/change-password/", payload);
    },

    deleteAccount: async () => {
        try {
            await deleteMe();
            return;
        } catch (error) {
            const id = getCurrentUserId();
            if (!id) throw error;
            await apiClient.delete(`/users/${id}/`);
        }
    },
};
