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

type RawListResponse<T> = {
    data?: T[];
    results?: T[];
    total?: number;
    count?: number;
    query?: string;
}
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

    if (typeof r.total === "number") {
        total = r.total;
    } else if (typeof r.count === "number") {
        total = r.count;
    }

    return {
        data: items,
        total,
        query: r.query,
    };
}
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

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/teams/${id}/`);
    },

    getMyTeams: async (ordering?: TeamFilters["ordering"]): Promise<ApiListResponse<TeamType>> => {
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
};