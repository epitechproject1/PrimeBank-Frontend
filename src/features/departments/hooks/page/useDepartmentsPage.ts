import { useMemo } from "react";
import { useDepartmentsQueries } from "./useDepartmentsQueries";
import { useDepartmentsActions } from "./useDepartmentsActions";
import { useDepartmentsUiState } from "./useDepartmentsUiState";
import type { DepartmentType } from "../../types/departments.type";

export type TeamLite = {
    id: number;
    name: string;
    description?: string | null;
    members_count?: number;
    membersCount?: number;
    owner?: {
        id: number;
        first_name: string;
        last_name: string;
        email?: string;
    } | null;
};

function sortPinnedByDate(items: DepartmentType[]) {
    return [...items].sort((a, b) => {
        const ap = a.is_pinned ?? 0;
        const bp = b.is_pinned ?? 0;
        if (bp !== ap) return bp - ap;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
}

function buildCounts(departments: DepartmentType[]) {
    const activeCount = departments.filter((d) => d.is_active).length;
    const directorCount = departments.filter((d) => d.director !== null).length;
    return { activeCount, directorCount };
}

export function useDepartmentsPage() {
    const ui = useDepartmentsUiState();
    const deptId = ui.detailsDepartment?.id;

    const { departmentsQuery, statsQuery, teamsQuery } = useDepartmentsQueries({
        search: ui.search,
        page: ui.page,
        pageSize: ui.pageSize,
        ordering: ui.ordering,
        deptId,
        detailsOpen: ui.detailsOpen,
    });

    const actions = useDepartmentsActions({
        deptId,
        search: ui.search,
        page: ui.page,
        pageSize: ui.pageSize,
        ordering: ui.ordering,
        detailsOpen: ui.detailsOpen,
    });

    const departments = useMemo(() => {
        const items = departmentsQuery.data?.items ?? [];

        if (!ui.ordering || ui.ordering === "-created_at") return sortPinnedByDate(items);

        const pinned = items.filter(d => (d.is_pinned ?? 0) === 1);
        const others = items.filter(d => (d.is_pinned ?? 0) !== 1);
        return [...pinned, ...others];
    }, [departmentsQuery.data, ui.ordering]);

    const total = departmentsQuery.data?.total ?? 0;

    const loading = departmentsQuery.isLoading;
    const spinning = departmentsQuery.isFetching;
    const searching = departmentsQuery.isFetching && !!ui.search.trim();

    const stats = statsQuery.data ?? null;

    const counts = useMemo(() => buildCounts(departments), [departments]);

    const departmentTeams = teamsQuery.data ?? [];
    const teamsLoading = teamsQuery.isFetching || teamsQuery.isLoading;
    const detailsLoading = teamsQuery.isLoading;

    return {
        loading,
        searching,
        spinning,

        departments,
        rawDepartments: departments,
        stats,
        activeCount: counts.activeCount,
        directorCount: counts.directorCount,

        page: ui.page,
        pageSize: ui.pageSize,
        total,
        onPageChange: ui.onPageChange,
        ordering: ui.ordering,
        onOrderingChange: ui.onOrderingChange,
        search: ui.search,
        setSearch: ui.onSearchChange,
        onSearchClear: ui.onSearchClear,
        viewMode: ui.viewMode,
        setViewMode: ui.setViewMode,
        onRefresh: actions.onRefresh,

        isModalOpen: ui.isModalOpen,
        editDepartment: ui.editDepartment,
        openCreate: ui.openCreate,
        openEdit: ui.openEdit,
        closeModal: ui.closeModal,
        onSaved: actions.onSaved,

        handleDelete: actions.handleDelete,
        deletingId: actions.deletingId,

        detailsOpen: ui.detailsOpen,
        detailsDepartment: ui.detailsDepartment,
        detailsLoading,
        handleView: ui.handleView,
        closeDetails: ui.closeDetails,

        departmentTeams,
        teamsLoading,
    };
}