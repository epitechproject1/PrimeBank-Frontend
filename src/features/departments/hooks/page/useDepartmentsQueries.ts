import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { DepartmentStats, DepartmentType } from "../../types/departments.type";
import { departmentService } from "../../services/departments.service";
import type { DepartmentFilters } from "../../services/departments.service";

type ListResponse<T> = { items: T[]; total: number };

export function useDepartmentsQueries(params: {
    search: string;
    page: number;
    pageSize: number;
    ordering?: DepartmentFilters["ordering"];
    deptId?: number;
    detailsOpen: boolean;
}) {
    const { search, page, pageSize, ordering, deptId, detailsOpen } = params;
    const q = search.trim();

    const departmentsQuery = useQuery<ListResponse<DepartmentType>, Error>({
        queryKey: ["departments", { q, page, pageSize, ordering }],
        queryFn: async () => {
            if (!q) {
                return departmentService.getAll({
                    page,
                    page_size: pageSize,
                    ordering,
                });
            }
            const res = await departmentService.search(q, page, pageSize, ordering);
            return { items: res.data ?? [], total: res.total ?? 0 };
        },
        staleTime: 0,
        gcTime: 0,
        placeholderData: keepPreviousData,
    });

    const statsQuery = useQuery<DepartmentStats, Error>({
        queryKey: ["departments-stats"],
        queryFn: () => departmentService.stats(),
        staleTime: 30_000,
    });

    const teamsQuery = useQuery({
        queryKey: ["departmentTeams", deptId],
        queryFn: () => departmentService.getTeams(deptId!),
        enabled: detailsOpen && !!deptId,
    });

    return { departmentsQuery, statsQuery, teamsQuery };
}