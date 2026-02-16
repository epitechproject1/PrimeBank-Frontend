import { useMemo } from "react";
import { User } from "../types/user.type";
import { roleKey } from "../utils/users-constants";

export function useUsersFilters(users: User[]) {
    return useMemo(() => {
        const activeCount = users.filter((u) => u.is_active).length;
        const adminsCount = users.filter((u) => roleKey(u.role) === "admin").length;
        const thisMonthCount = users.filter((u) => {
            const created = new Date(u.created_at);
            const now = new Date();
            return (
                created.getMonth() === now.getMonth() &&
                created.getFullYear() === now.getFullYear()
            );
        }).length;

        return {
            filtered: users,
            activeCount,
            adminsCount,
            thisMonthCount,
        };
    }, [users]);
}
