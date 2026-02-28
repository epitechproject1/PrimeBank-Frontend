import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUsers } from "./useUsers";
import type { User, UpdateUserDTO, CreateUserDTO } from "../types/user.type";
import { getUsersTableColumns } from "../utils/users-table-columns";
import { useUsersFilters } from "./useUsersFilters";
import { useDebouncedValue } from "./useDebouncedValue";
import type { UserSearchFilters } from "../../../services/usersApi";
import { useUsersExport } from "./useUsersExport";

export function useUsersPageState(filters: UserSearchFilters) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const debouncedFilters = useDebouncedValue(filters, 400);
    const { exporting, handleExport, exportContextHolder } = useUsersExport(filters);
    const {
        users = [],
        total,
        page,
        pageSize,
        totalPages,
        isLoading,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        refetch,
    } = useUsers(debouncedFilters);

    const closeForm = useCallback(() => {
        setOpen(false);
        setEditingUser(null);
    }, []);

    const openAdd = useCallback(() => {
        setEditingUser(null);
        setOpen(true);
    }, []);

    const handleEdit = useCallback((user: User) => {
        setEditingUser(user);
        setOpen(true);
    }, []);

    const handleDelete = useCallback((id: string) => deleteUser.mutate(id), [deleteUser]);

    const handleToggleStatus = useCallback(
        (id: string, is_active: boolean) => {
            setTogglingId(id);
            toggleUserStatus.mutate(
                { id, is_active },
                { onSettled: () => setTogglingId(null) }
            );
        },
        [toggleUserStatus]
    );

    const handleSubmit = useCallback(
        (values: CreateUserDTO | UpdateUserDTO) => {
            if (editingUser) {
                updateUser.mutate(
                    { id: editingUser.id, data: values as UpdateUserDTO },
                    { onSuccess: closeForm }
                );
                return;
            }
            createUser.mutate(values as CreateUserDTO, { onSuccess: closeForm });
        },
        [closeForm, createUser, editingUser, updateUser]
    );

    const { filtered, activeCount, thisMonthCount } = useUsersFilters(users);
    const columns = useMemo(
        () =>
            getUsersTableColumns(
                handleEdit,
                handleDelete,
                handleToggleStatus,
                (id) => id === togglingId
            ),
        [handleDelete, handleEdit, handleToggleStatus, togglingId]
    );

    const refresh = useCallback(() => {
        void queryClient.invalidateQueries({ queryKey: ["users"] });
        void refetch();
    }, [queryClient, refetch]);

    return {
        users,
        total,
        page,
        pageSize,
        totalPages,
        isLoading,
        viewMode,
        setViewMode,
        open,
        editingUser,
        openAdd,
        handleEdit,
        handleDelete,
        handleToggleStatus,
        handleSubmit,
        closeForm,
        columns,
        filtered,
        activeCount,
        thisMonthCount,
        refresh,
        formLoading: createUser.isPending || updateUser.isPending,
        handleExport,
        exporting,
        exportContextHolder,
        isToggling: (id: string) => id === togglingId,
    };
}
