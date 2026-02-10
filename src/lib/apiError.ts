import axios from "axios";

export type ApiError = {
    status: number;
    message: string;
    details?: unknown;
};

export function normalizeApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        return {
            status: error.response?.status ?? 0,
            message:
                (error.response?.data as any)?.detail ||
                (error.response?.data as any)?.message ||
                "Erreur serveur",
            details: error.response?.data,
        };
    }

    return {
        status: 0,
        message: "Erreur inconnue",
    };
}
