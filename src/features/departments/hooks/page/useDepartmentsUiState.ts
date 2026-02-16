import { useCallback, useState } from "react";
import type { DepartmentType } from "../../types/departments.type";

export function useDepartmentsUiState() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [isModalOpen, setModalOpen] = useState(false);
    const [editDepartment, setEditDepartment] = useState<DepartmentType | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsDepartment, setDetailsDepartment] = useState<DepartmentType | null>(null);

    const onPageChange = useCallback((nextPage: number, nextPageSize: number) => {
        setPage(nextPage);
        setPageSize(nextPageSize);
    }, []);

    const onSearchClear = useCallback(() => {
        setSearch("");
        setPage(1);
    }, []);

    const openCreate = useCallback(() => {
        setEditDepartment(null);
        setModalOpen(true);
    }, []);

    const openEdit = useCallback((dept: DepartmentType) => {
        setDetailsOpen(false);
        setDetailsDepartment(null);
        setEditDepartment(dept);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setEditDepartment(null);
    }, []);

    const handleView = useCallback((dept: DepartmentType) => {
        setDetailsDepartment(dept);
        setDetailsOpen(true);
    }, []);

    const closeDetails = useCallback(() => {
        setDetailsOpen(false);
        setDetailsDepartment(null);
    }, []);

    return {
        viewMode,
        setViewMode,

        search,
        setSearch,
        onSearchClear,

        page,
        pageSize,
        onPageChange,

        isModalOpen,
        editDepartment,
        openCreate,
        openEdit,
        closeModal,

        detailsOpen,
        detailsDepartment,
        handleView,
        closeDetails,
    };
}
