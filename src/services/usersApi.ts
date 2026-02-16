import { apiClient } from "../lib/api_client/apiClient";
import type { User } from "../features/users/types/user.type";

export type UserSearchFilters = {
    q?: string;
    role?: "ADMIN" | "MANAGER" | "USER";
    email?: string;
    is_active?: boolean;
    created_from?: string;
    created_to?: string;
    ordering?: string;
};

export type UserExportParams = UserSearchFilters;

export type UserSearchResponse = {
    data: User[];
    total: number;
    query: string;
};

function buildParams(filters: UserSearchFilters) {
    const params: Record<string, string> = {};
    if (filters.q) params.q = filters.q;
    if (filters.role) params.role = filters.role;
    if (filters.email) params.email = filters.email;
    if (filters.is_active !== undefined) params.is_active = String(filters.is_active);
    if (filters.created_from) params.created_from = filters.created_from;
    if (filters.created_to) params.created_to = filters.created_to;
    if (filters.ordering) params.ordering = filters.ordering;
    return params;
}

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

async function parseErrorMessage(error: unknown) {
    const err = error as { response?: { data?: Blob } };
    const blob = err.response?.data;
    if (blob instanceof Blob) {
        const text = await blob.text();
        try {
            const json = JSON.parse(text);
            return json.detail || json.error || text;
        } catch {
            return text || "Erreur serveur";
        }
    }
    return "Erreur serveur";
}

export async function searchUsers(filters: UserSearchFilters): Promise<UserSearchResponse> {
    const { data } = await apiClient.get<UserSearchResponse>("/users/search/", {
        params: buildParams(filters),
    });
    return data;
}

export async function exportUsers(params: UserExportParams, fileFormat: "csv" | "pdf"): Promise<void> {
    try {
        const response = await apiClient.get<Blob>("/users/export/", {
            params: { ...buildParams(params), file_format: fileFormat },
            responseType: "blob",
        });
        const filename = fileFormat === "pdf" ? "users.pdf" : "users.csv";
        downloadBlob(response.data, filename);
    } catch (error) {
        const message = await parseErrorMessage(error);
        const err = error as { response?: { status?: number } };
        const status = err.response?.status;
        const wrapped = new Error(message) as Error & { status?: number };
        wrapped.status = status;
        throw wrapped;
    }
}

export async function toggleUserActive(userId: number | string, isActive: boolean): Promise<User> {
    const { data } = await apiClient.patch<User>(`/users/${userId}/`, { is_active: isActive });
    return data;
}
