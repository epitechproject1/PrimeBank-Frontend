
import {LoginPayload, LoginResponse} from "../types/login.types.ts";
import {apiClient} from "../../../../lib/apiClient.ts";
import {authTokens} from "../../../../lib/authTokens.ts";


export async function login(payload: LoginPayload) {
    const { data } = await apiClient.post<LoginResponse>(
        "/auth/login/",
        payload
    );

    authTokens.setTokens(data.access_token, data.refresh_token);

    return data;
}
