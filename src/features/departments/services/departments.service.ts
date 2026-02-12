import { apiClient } from "../../../lib/api_client/apiClient.ts";
import { DepartmentType } from "../types/departments.type.ts";

export type CreateDepartmentPayload = {
    name: string;
    description?: string | null;
    director_id: number;
};

export type UpdateDepartmentPayload = Partial<CreateDepartmentPayload>;

export const departmentService = {
    getAll: async (): Promise<DepartmentType[]> => {
        const { data } = await apiClient.get<DepartmentType[]>("/departments/");
        return data;
    },

    getById: async (id: number): Promise<DepartmentType> => {
        const { data } = await apiClient.get<DepartmentType>(`/departments/${id}/`);
        return data;
    },

    create: async (payload: CreateDepartmentPayload): Promise<DepartmentType> => {
        const { data } = await apiClient.post<DepartmentType>(
            "/departments/",
            payload
        );
        return data;
    },

    update: async (
        id: number,
        payload: UpdateDepartmentPayload
    ): Promise<DepartmentType> => {
        const { data } = await apiClient.put<DepartmentType>(
            `/departments/${id}/`,
            payload
        );
        return data;
    },

    partialUpdate: async (
        id: number,
        payload: UpdateDepartmentPayload
    ): Promise<DepartmentType> => {
        const { data } = await apiClient.patch<DepartmentType>(
            `/departments/${id}/`,
            payload
        );
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/departments/${id}/`);
    },
};
