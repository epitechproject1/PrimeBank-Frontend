import { apiClient } from "../../../lib/api_client/apiClient";
import type {
    DepartmentType,
    CreateDepartmentPayload,
    UpdateDepartmentPayload,
    ApiListResponse,
    ApiPaginatedResponse,
    ApiSearchResponse,
    DepartmentStats,
    DepartmentOrdering,
} from "../types/departments.type";
import type { TeamLite } from "../hooks/page/useDepartmentsPage";

export type DepartmentFilters = {
    q?: string;
    is_active?: boolean;
    director_id?: number;
    my_departments?: boolean;
    page?: number;
    page_size?: number;
    ordering?: DepartmentOrdering;
};

type UnknownListResponse<T> =
    | T[]
    | Partial<ApiListResponse<T>>
    | Partial<ApiPaginatedResponse<T>>
    | Partial<ApiListResponse<T> & ApiPaginatedResponse<T>>;

type ListLike<T> = {
    data?: T[];
    total?: number;
    results?: T[];
    count?: number;
};

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function asListLike<T>(value: unknown): ListLike<T> | null {
    if (!isObject(value)) return null;
    return value as ListLike<T>;
}

function normalizeList<T>(payload: UnknownListResponse<T>): { items: T[]; total: number } {
    if (Array.isArray(payload)) return { items: payload, total: payload.length };

    const obj = asListLike<T>(payload);
    if (!obj) return { items: [], total: 0 };

    if (Array.isArray(obj.data)) {
        return { items: obj.data, total: typeof obj.total === "number" ? obj.total : obj.data.length };
    }

    if (Array.isArray(obj.results)) {
        return { items: obj.results, total: typeof obj.count === "number" ? obj.count : obj.results.length };
    }

    return { items: [], total: 0 };
}
function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

export const departmentService = {
    getAll: async (filters?: DepartmentFilters): Promise<{ items: DepartmentType[]; total: number }> => {
        const { data } = await apiClient.get<UnknownListResponse<DepartmentType>>("/departments/", {
            params: filters ?? {},
        });
        return normalizeList<DepartmentType>(data);
    },

    search: async (
        q: string,
        page = 1,
        limit = 20,
        ordering?: DepartmentFilters["ordering"],
        extra?: Omit<DepartmentFilters, "q" | "page" | "page_size" | "ordering">
    ): Promise<ApiSearchResponse<DepartmentType>> => {
        const { data } = await apiClient.get<ApiSearchResponse<DepartmentType>>("/departments/search/", {
            params: { q, page, limit, ...(ordering ? { ordering } : {}), ...(extra ?? {}) },
        });
        return data;
    },

    getById: async (id: number): Promise<DepartmentType> => {
        const { data } = await apiClient.get<DepartmentType>(`/departments/${id}/`);
        return data;
    },

    create: async (payload: CreateDepartmentPayload): Promise<DepartmentType> => {
        const { data } = await apiClient.post<DepartmentType>("/departments/", payload);
        return data;
    },

    update: async (id: number, payload: UpdateDepartmentPayload): Promise<DepartmentType> => {
        const { data } = await apiClient.patch<DepartmentType>(`/departments/${id}/`, payload);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/departments/${id}/`);
    },

    getTeams: async (departmentId: number): Promise<TeamLite[]> => {
        const { data } = await apiClient.get<TeamLite[]>(
            `/departments/${departmentId}/teams/`
        );
        return data;
    },

    stats: async (): Promise<DepartmentStats> => {
        const { data } = await apiClient.get<DepartmentStats>("/departments/stats/");
        return data;
    },

    exportCsv: async (filters?: { q?: string; ordering?: DepartmentOrdering }) => {
        const res = await apiClient.get("/departments/export/csv/", {
            params: filters ?? {},
            responseType: "blob",
        });
        downloadBlob(res.data, "departments.csv");
    },

    exportPdf: async (filters?: { q?: string; ordering?: DepartmentOrdering }) => {
        const res = await apiClient.get("/departments/export/pdf/", {
            params: filters ?? {},
            responseType: "blob",
        });
        downloadBlob(res.data, "departments.pdf");
    },

    importCsv: async (file: File) => {
        const form = new FormData();
        form.append("file", file);

        const { data } = await apiClient.post("/departments/import/csv/", form, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return data;
    },
};