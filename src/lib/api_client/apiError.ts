import axios, { AxiosError } from "axios";

type ErrorResponseData = {
    detail?: string;
    message?: string;
};

export type ApiError = {
    status: number;
    message: string;
    details?: unknown;
};

function extractErrorMessage(error: AxiosError): string {
    const data = error.response?.data as ErrorResponseData | undefined;

    if (data?.detail) {
        return data.detail;
    }

    if (data?.message) {
        return data.message;
    }

    return "Erreur serveur";
}

export function normalizeApiError(error: unknown): ApiError {
    if (!axios.isAxiosError(error)) {
        return {
            status: 0,
            message: "Erreur inconnue",
        };
    }

    return {
        status: error.response?.status ?? 0,
        message: extractErrorMessage(error),
        details: error.response?.data,
    };
}
