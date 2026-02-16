import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { DepartmentStats, DepartmentType } from "../../types/departments.type";
import { departmentService } from "../../services/departments.service";
import type { TeamLite } from "./useDepartmentsPage";

type ListResponse<T> = { items: T[]; total: number };

function buildDeptFilters(search: string, page: number, pageSize: number) {
    const q = search.trim();
    return {
        ...(q ? { q } : {}),
        page,
        page_size: pageSize,
    };
}

export function useDepartmentsQueries(params: {
    search: string;
    page: number;
    pageSize: number;
    deptId?: number;
    detailsOpen: boolean;
}) {
    const { search, page, pageSize, deptId, detailsOpen } = params;

    const departmentsQuery = useQuery<ListResponse<DepartmentType>, Error>({
        queryKey: ["departments", search, page, pageSize],
        queryFn: () => departmentService.getAll(buildDeptFilters(search, page, pageSize)),
        staleTime: 20_000,
        placeholderData: keepPreviousData,
    });

    const statsQuery = useQuery<DepartmentStats, Error>({
        queryKey: ["departments-stats"],
        queryFn: () => departmentService.stats(),
        staleTime: 20_000,
    });

    const teamsQuery = useQuery<ListResponse<TeamLite>, Error>({
        queryKey: ["department-teams", deptId],
        queryFn: () => departmentService.getTeams(deptId as number) as Promise<ListResponse<TeamLite>>,
        enabled: detailsOpen && typeof deptId === "number",
        staleTime: 20_000,
        placeholderData: keepPreviousData,
    });

    return { departmentsQuery, statsQuery, teamsQuery };
}
