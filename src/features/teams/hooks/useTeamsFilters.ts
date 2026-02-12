import { useMemo } from "react";
import { TeamType } from "../types/teams.type";

export function useTeamsFilters(teams: TeamType[], search: string) {
    const filtered = useMemo(() => {
        const searchLower = search.toLowerCase();

        return teams.filter((t) =>
            t.name.toLowerCase().includes(searchLower) ||
            (t.description ?? "").toLowerCase().includes(searchLower)
        );
    }, [teams, search]);

    const deptCount = useMemo(() => {
        return new Set(
            teams
                .map((t) => t.department?.id)
                .filter((id): id is number => Boolean(id))
        ).size;
    }, [teams]);

    const thisMonth = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return teams.filter((t) => {
            const created = new Date(t.created_at);
            return (
                created.getMonth() === currentMonth &&
                created.getFullYear() === currentYear
            );
        }).length;
    }, [teams]);

    return { filtered, deptCount, thisMonth };
}