// src/features/users/hooks/useUsers.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { userService } from "../services/user.service";
import { CreateUserDTO, UpdateUserDTO } from "../types/user.type";

interface UpdateUserParams {
    id: string;
    data: UpdateUserDTO;
}

interface ToggleStatusParams {
    id: string;
    is_active: boolean;
}

export const useUsers = () => {
    const queryClient = useQueryClient();

    const usersQuery = useQuery({
        queryKey: ["users"],
        queryFn: userService.getAll,
    });

    const createUser = useMutation({
        mutationFn: (payload: CreateUserDTO) => userService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            message.success("Utilisateur créé avec succès");
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { email?: string[] } } };
            if (err.response?.data?.email) {
                message.error("Cet email est déjà utilisé");
            } else {
                message.error("Erreur lors de la création");
            }
        },
    });

    const updateUser = useMutation({
        mutationFn: ({ id, data }: UpdateUserParams) => userService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            message.success("Utilisateur modifié avec succès");
        },
        onError: () => {
            message.error("Erreur lors de la modification");
        },
    });

    const deleteUser = useMutation({
        mutationFn: (id: string) => userService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            message.success("Utilisateur supprimé avec succès");
        },
        onError: () => {
            message.error("Erreur lors de la suppression");
        },
    });

    const toggleUserStatus = useMutation({
        mutationFn: ({ id, is_active }: ToggleStatusParams) => 
            userService.toggleStatus(id, is_active),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            message.success(`Utilisateur ${data.is_active ? 'activé' : 'désactivé'}`);
        },
        onError: () => {
            message.error("Erreur lors du changement de statut");
        },
    });

    return {
        data: usersQuery.data,
        users: usersQuery.data || [],
        isLoading: usersQuery.isLoading,
        isError: usersQuery.isError,
        error: usersQuery.error,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
    };
};