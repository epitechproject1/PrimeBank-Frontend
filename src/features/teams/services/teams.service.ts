import { apiClient } from "../../../lib/api_client/apiClient.ts";
import type {
    TeamType,
    CreateTeamPayload,
    UpdateTeamPayload,
    TeamFilters,
    ApiListResponse,
    ApiSearchResponse,
    ApiPaginatedResponse,
    TeamMember,
    TeamMembersParams,
} from "../types/teams.type.ts";

export type TeamsFilters = {
    q?: string;
    department_id?: number;
    owner_id?: number;
    my_teams?: boolean;
    ordering?: string;
    page?: number;
    page_size?: number;
};

type RawListResponse<T> = {
    data?: T[];
    results?: T[];
    total?: number;
    count?: number;
    query?: string;
};

function normalizeList<T>(raw: unknown): ApiListResponse<T> {
    if (!raw || typeof raw !== "object") {
        return { data: [], total: 0 };
    }

    const r = raw as RawListResponse<T>;
    let items: T[] = [];

    if (Array.isArray(r.data)) {
        items = r.data;
    } else if (Array.isArray(r.results)) {
        items = r.results;
    }

    let total = items.length;
    if (typeof r.total === "number") total = r.total;
    else if (typeof r.count === "number") total = r.count;

    return { data: items, total, query: r.query };
}

/** Déclenche le téléchargement d'un Blob dans le navigateur */
function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export type ImportCsvResult = {
    created: number;
    updated: number;
    errors: { row?: number; message: string }[];
};

export const teamService = {
    getAll: async (filters?: TeamFilters): Promise<ApiListResponse<TeamType>> => {
        const { data } = await apiClient.get("/teams/", { params: filters });
        return normalizeList<TeamType>(data);
    },

    getById: async (id: number): Promise<TeamType> => {
        const { data } = await apiClient.get<TeamType>(`/teams/${id}/`);
        return data;
    },

    create: async (payload: CreateTeamPayload): Promise<TeamType> => {
        const { data } = await apiClient.post<TeamType>("/teams/", payload);
        return data;
    },

    update: async (id: number, payload: UpdateTeamPayload): Promise<TeamType> => {
        const { data } = await apiClient.patch<TeamType>(`/teams/${id}/`, payload);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/teams/${id}/`);
    },

    getMembers: async (
        teamId: number,
        params?: TeamMembersParams
    ): Promise<ApiPaginatedResponse<TeamMember>> => {
        const { data } = await apiClient.get<ApiPaginatedResponse<TeamMember>>(
            `/teams/${teamId}/members/`,
            { params }
        );
        return data;
    },

    getMyTeams: async (
        ordering?: TeamFilters["ordering"]
    ): Promise<ApiListResponse<TeamType>> => {
        const { data } = await apiClient.get("/teams/my-teams/", {
            params: ordering ? { ordering } : undefined,
        });
        return normalizeList<TeamType>(data);
    },

    search: async (
        q: string,
        page = 1,
        limit = 20,
        ordering?: TeamFilters["ordering"]
    ): Promise<ApiSearchResponse<TeamType>> => {
        const { data } = await apiClient.get<ApiSearchResponse<TeamType>>("/teams/search/", {
            params: { q, page, limit, ...(ordering ? { ordering } : {}) },
        });
        return data;
    },

    // ─── Export ───────────────────────────────────────────────────────────────

    exportCsv: async (
        filters?: TeamsFilters,
        filename = "teams.csv"
    ): Promise<Blob> => {
        const { data, headers } = await apiClient.get("/teams/export/csv/", {
            params: filters,
            responseType: "blob",
        });

        const disposition: string = headers?.["content-disposition"] ?? "";
        const match = disposition.match(/filename\*?=["']?(?:UTF-8'')?([^;"'\n]+)/i);
        const resolvedFilename = match?.[1]?.trim() ?? filename;

        downloadBlob(data, resolvedFilename);
        return data;
    },

    /**
     * Télécharge l'export PDF des équipes.
     */
    exportPdf: async (
        filters?: TeamsFilters,
        filename = "teams.pdf"
    ): Promise<Blob> => {
        const { data, headers } = await apiClient.get("/teams/export/pdf/", {
            params: filters,
            responseType: "blob",
        });

        const disposition: string = headers?.["content-disposition"] ?? "";
        const match = disposition.match(/filename\*?=["']?(?:UTF-8'')?([^;"'\n]+)/i);
        const resolvedFilename = match?.[1]?.trim() ?? filename;

        downloadBlob(data, resolvedFilename);
        return data;
    },

    // ─── Import ───────────────────────────────────────────────────────────────
    importCsv: async (file: File): Promise<ImportCsvResult> => {
        const allowed = ["text/csv", "application/vnd.ms-excel", "text/plain"];
        if (!allowed.includes(file.type) && !file.name.endsWith(".csv")) {
            throw new Error("Le fichier doit être un CSV valide (.csv).");
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const { data } = await apiClient.post<ImportCsvResult>(
                "/teams/import/csv/",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            return {
                created: data?.created ?? 0,
                updated: data?.updated ?? 0,
                errors: Array.isArray(data?.errors) ? data.errors : [],
            };
        } catch (err: any) {
            const apiErrors = err?.response?.data?.errors;
            if (Array.isArray(apiErrors)) {
                return { created: 0, updated: 0, errors: apiErrors };
            }
            throw err;
        }
    },
};