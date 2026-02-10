import {apiClient} from "../../../lib/api_client/apiClient.ts";
import {UserProfile} from "../types/user.type.ts";

export async function getMe() {
    // Note: L'URL doit correspondre à celle de ton ViewSet ('users/me/')
    const { data } = await apiClient.get<UserProfile>("/users/me/");
    return data;
}