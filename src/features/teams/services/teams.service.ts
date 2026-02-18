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

export const teamService = {
    getAll: async (filters?: TeamFilters): Promise<ApiListResponse<TeamType>> => {
        const { data } = await apiClient.get<ApiListResponse<TeamType>>("/teams/", {
            params: filters,
        });
        return data;
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
        const { data } = await apiClient.get<ApiListResponse<TeamType>>("/teams/my-teams/", {
            params: ordering ? { ordering } : undefined,
        });
        return data;
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
