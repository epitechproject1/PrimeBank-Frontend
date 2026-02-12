import { useMemo } from "react";
import { User } from "../types/user.type";

export function useUsersFilters(users: User[], search: string) {
    return useMemo(() => {
        const term = search.trim().toLowerCase();
        const filtered = term
            ? users.filter((u) => {
                  const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
                  return (
                      fullName.includes(term) ||
                      u.email.toLowerCase().includes(term) ||
                      (u.phone_number || "").toLowerCase().includes(term)
                  );
              })
            : users;

        const activeCount = users.filter((u) => u.is_active).length;
        const adminsCount = users.filter((u) => u.role === "admin").length;
        const thisMonthCount = users.filter((u) => {
            const created = new Date(u.created_at);
            const now = new Date();
            return (
                created.getMonth() === now.getMonth() &&
                created.getFullYear() === now.getFullYear()
            );
        }).length;

        return {
            filtered,
            activeCount,
            adminsCount,
            thisMonthCount,
        };
    }, [users, search]);
}
