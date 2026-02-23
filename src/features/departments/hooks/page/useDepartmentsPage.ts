import { useMemo } from "react";
import { useDepartmentsQueries } from "./useDepartmentsQueries";
import { useDepartmentsActions } from "./useDepartmentsActions";
import { useDepartmentsUiState } from "./useDepartmentsUiState";

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

    const departments = useMemo(
        () => departmentsQuery.data?.items ?? [],
        [departmentsQuery.data]
    );

    const total = departmentsQuery.data?.total ?? 0;

    const loading = departmentsQuery.isLoading;
    const spinning = departmentsQuery.isFetching;
    const searching = departmentsQuery.isFetching && !!ui.search.trim();

    const stats = statsQuery.data ?? null;

    const activeCount = useMemo(
        () => departments.filter((d) => d.is_active).length,
        [departments]
    );

    const directorCount = useMemo(
        () => departments.filter((d) => d.director !== null).length,
        [departments]
    );

    const departmentTeams = teamsQuery.data?.items ?? [];
    const teamsLoading = teamsQuery.isFetching || teamsQuery.isLoading;
    const detailsLoading = teamsQuery.isLoading;

    return {
        loading,
        searching,
        spinning,

        departments,
        rawDepartments: departments,
        stats,
        activeCount,
        directorCount,

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