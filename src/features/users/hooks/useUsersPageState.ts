import { useCallback, useMemo, useState } from "react";
import { useUsers } from "./useUsers";
import type { User, UpdateUserDTO, CreateUserDTO } from "../types/user.type";
import { getUsersTableColumns } from "../utils/users-table-columns";
import { useUsersFilters } from "./useUsersFilters";
import { exportUsersCsv, exportUsersPdf, exportUsersWord } from "../utils/users-export";

export function useUsersPageState() {
    const {
        users = [],
        isLoading,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        refetch,
    } = useUsers();
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
        (id: string, is_active: boolean) => toggleUserStatus.mutate({ id, is_active }),
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

    const { filtered, activeCount, thisMonthCount } = useUsersFilters(users, search);
    const columns = useMemo(
        () => getUsersTableColumns(handleEdit, handleDelete, handleToggleStatus),
        [handleDelete, handleEdit, handleToggleStatus]
    );
    const handleExport = useCallback(
        (format: "excel" | "word" | "pdf") => {
            if (format === "excel") exportUsersCsv(filtered);
            if (format === "word") exportUsersWord(filtered);
            if (format === "pdf") exportUsersPdf(filtered);
        },
        [filtered]
    );
    const refresh = useCallback(() => {
        void refetch();
    }, [refetch]);

    return {
        users,
        isLoading,
        search,
        setSearch,
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
    };
}
