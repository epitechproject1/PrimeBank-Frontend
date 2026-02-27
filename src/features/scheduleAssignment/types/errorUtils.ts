import type { AxiosError } from "axios";

type ApiErrorShape = { detail?: string; message?: string };

export function getErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof Error) return err.message;

    const axiosErr = err as AxiosError<ApiErrorShape>;
    const data = axiosErr?.response?.data;

    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (typeof data.detail === "string") return data.detail;
    if (typeof data.message === "string") return data.message;

    return fallback;
}