import { apiClient } from "../../../lib/api_client/apiClient";
import { User } from "../../users/types/user.type";

export const profileService = {
  me: async (): Promise<User> => {
    const { data } = await apiClient.get("/users/me/");
    return data;
  },

  update: async (payload: Partial<User>) => {
    const { data } = await apiClient.patch("/users/me/", payload);
    return data;
  },

  changePassword: async (payload: {
    old_password: string;
    new_password: string;
  }) => {
    await apiClient.post("/users/change-password/", payload);
  },

  deleteAccount: async () => {
    await apiClient.delete("/users/me/");
  },
};
