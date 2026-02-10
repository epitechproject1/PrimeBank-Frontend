import axios, { AxiosError, AxiosInstance } from "axios";
import { authTokens } from "./authTokens";
import { normalizeApiError } from "./apiError";

const API_BASE_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null = null) {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token!);
    });

    failedQueue = [];
}

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

/* ============================
   REQUEST INTERCEPTOR
============================ */
apiClient.interceptors.request.use((config) => {
    const accessToken = authTokens.getAccess();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

/* ============================
   RESPONSE INTERCEPTOR
============================ */
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            authTokens.getRefresh()
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(apiClient(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/refresh/`,
                    {
                        refresh: authTokens.getRefresh(),
                    }
                );

                const newAccess = refreshResponse.data.access;
                authTokens.setTokens(newAccess, authTokens.getRefresh()!);

                apiClient.defaults.headers.Authorization = `Bearer ${newAccess}`;
                processQueue(null, newAccess);

                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                authTokens.clear();

                // 👉 ici tu peux rediriger vers /login
                return Promise.reject(normalizeApiError(refreshError));
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(normalizeApiError(error));
    }
);
