import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { profileService } from "../services/profile.service";

export const useProfile = () => {
  const qc = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["me"],
    queryFn: profileService.me,
  });

  const updateMutation = useMutation({
    mutationFn: profileService.update,
    onSuccess: () => {
      message.success("Profil mis a jour");
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: () => {
      message.error("Erreur lors de la mise a jour du profil");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: profileService.changePassword,
    onSuccess: () => message.success("Mot de passe change"),
    onError: () => message.error("Erreur lors du changement de mot de passe"),
  });

  const deleteMutation = useMutation({
    mutationFn: profileService.deleteAccount,
    onSuccess: () => {
      message.success("Compte supprime");
      localStorage.clear();
      window.location.href = "/login";
    },
    onError: () => message.error("Erreur lors de la suppression du compte"),
  });

  return {
    profileQuery,
    updateMutation,
    passwordMutation,
    deleteMutation,
  };
};
