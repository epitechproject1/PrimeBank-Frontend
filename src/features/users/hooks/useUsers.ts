// src/features/users/types/useUsers.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { userService } from "../services/user.service";
import { CreateUserDTO, UpdateUserDTO } from "../types/user.type";
import { searchUsers, toggleUserActive, UserSearchFilters } from "../../../services/usersApi";
import { ApiError } from "../../../lib/api_client/apiError";

interface UpdateUserParams {
    id: string;
    data: UpdateUserDTO;
}

interface ToggleStatusParams {
    id: string;
    is_active: boolean;
}

type AxiosLikeError = {
    response?: {
        status?: number;
    };
};

function handleToggleError(error: unknown) {
    const apiError = error as ApiError;
    const axiosError = error as AxiosLikeError;
    const status = apiError?.status ?? axiosError?.response?.status;

    if (status === 403) {
        message.error("Action reservee aux administrateurs");
        return;
    }
    if (status === 401) {
        message.error("Session expiree, veuillez vous reconnecter");
        return;
    }
    message.error("Erreur lors du changement de statut");
}

export const useUsers = (filters: UserSearchFilters) => {
    const queryClient = useQueryClient();

    const usersQuery = useQuery({
        queryKey: ["users", filters],
        queryFn: () => searchUsers(filters),
    });

    const createUser = useMutation({
        mutationFn: (payload: CreateUserDTO) => userService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            message.success("Utilisateur cree avec succes");
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { email?: string[] } } };
            if (err.response?.data?.email) {
                message.error("Cet email est deja utilise");
            } else {
                message.error("Erreur lors de la creation");
            }
        },
    });

    const updateUser = useMutation({
        mutationFn: ({ id, data }: UpdateUserParams) => userService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            message.success("Utilisateur modifie avec succes");
        },
        onError: () => {
            message.error("Erreur lors de la modification");
        },
    });

    const deleteUser = useMutation({
        mutationFn: (id: string) => userService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            message.success("Utilisateur supprime avec succes");
        },
        onError: () => {
            message.error("Erreur lors de la suppression");
        },
    });

    const toggleUserStatus = useMutation({
        mutationFn: ({ id, is_active }: ToggleStatusParams) =>
            toggleUserActive(id, is_active),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            message.success(`Utilisateur ${data.is_active ? "active" : "desactive"}`);
        },
        onError: handleToggleError,
    });

    return {
        data: usersQuery.data?.data,
        total: usersQuery.data?.total ?? 0,
        query: usersQuery.data?.query ?? "",
        users: usersQuery.data?.data || [],
        isLoading: usersQuery.isLoading,
        isError: usersQuery.isError,
        error: usersQuery.error,
        refetch: usersQuery.refetch,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
    };
};
