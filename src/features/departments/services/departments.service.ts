import { apiClient } from "../../../lib/api_client/apiClient";
import type {
    DepartmentType,
    CreateDepartmentPayload,
    UpdateDepartmentPayload,
    ApiListResponse,
    ApiPaginatedResponse,
    DepartmentStats,
} from "../types/departments.type";
import type { TeamLite } from "../hooks/page/useDepartmentsPage";

export type DepartmentFilters = {
    q?: string;
    is_active?: boolean;
    director_id?: number;

    page?: number;
    page_size?: number;
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
        return {
            items: obj.data,
            total: typeof obj.total === "number" ? obj.total : obj.data.length,
        };
    }

    if (Array.isArray(obj.results)) {
        return {
            items: obj.results,
            total: typeof obj.count === "number" ? obj.count : obj.results.length,
        };
    }

    return { items: [], total: 0 };
}

export const departmentService = {
    getAll: async (filters?: DepartmentFilters): Promise<{ items: DepartmentType[]; total: number }> => {
        const params = { ...(filters ?? {}), _t: Date.now() };

        const { data } = await apiClient.get<UnknownListResponse<DepartmentType>>("/departments/", {
            params,
        });

        return normalizeList<DepartmentType>(data);
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

    getTeams: async (departmentId: number): Promise<{ items: TeamLite[]; total: number }> => {
        const { data } = await apiClient.get<UnknownListResponse<TeamLite>>(
            `/departments/${departmentId}/teams/`,
            { params: { _t: Date.now() } }
        );
        return normalizeList<TeamLite>(data);
    },

    stats: async (): Promise<DepartmentStats> => {
        const { data } = await apiClient.get<DepartmentStats>("/departments/stats/", {
            params: { _t: Date.now() },
        });
        return data;
    },
};
