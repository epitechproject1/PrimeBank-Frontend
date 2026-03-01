// src/features/departments/hooks/useDepartmentsData.ts

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api_client/apiClient";
import {DepartmentType} from "../../departments/types/departments.type.ts";

async function fetchDepartments(): Promise<DepartmentType[]> {
    const res = await apiClient.get<{ data: DepartmentType[] } | DepartmentType[]>("/departments/");
    const payload = res.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray((payload as { data: DepartmentType[] }).data)) return (payload as { data: DepartmentType[] }).data;
    return [];
}

export function useDepartmentsData() {
    const query = useQuery({
        queryKey: ["departments"],
        queryFn: fetchDepartments,
        staleTime: 60_000,
    });

    return {
        departments: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}