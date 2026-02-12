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
      message.success("Profil mis à jour");
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: profileService.changePassword,
    onSuccess: () => message.success("Mot de passe changé"),
  });

  const deleteMutation = useMutation({
    mutationFn: profileService.deleteAccount,
    onSuccess: () => {
      message.success("Compte supprimé");
      localStorage.clear();
    },
  });

  return {
    profileQuery,
    updateMutation,
    passwordMutation,
    deleteMutation,
  };
};
