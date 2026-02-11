import { apiClient } from "../../../lib/api_client/apiClient.ts";
import { TeamType, CreateTeamPayload, UpdateTeamPayload, TeamFilters } from "../types/teams.type.ts";

export const teamService = {
    getAll: async (filters?: TeamFilters): Promise<TeamType[]> => {
        const { data } = await apiClient.get<TeamType[]>("/teams/", { params: filters });
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

    update: async (id: number, payload: CreateTeamPayload): Promise<TeamType> => {
        const { data } = await apiClient.put<TeamType>(`/teams/${id}/`, payload);
        return data;
    },

    partialUpdate: async (id: number, payload: UpdateTeamPayload): Promise<TeamType> => {
        const { data } = await apiClient.patch<TeamType>(`/teams/${id}/`, payload);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/teams/${id}/`);
    },

    getMyTeams: async (): Promise<TeamType[]> => {
        const { data } = await apiClient.get<TeamType[]>("/teams/my-teams/");
        return data;
    }
};