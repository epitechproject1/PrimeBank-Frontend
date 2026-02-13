import { useMemo } from "react";
import type { TeamType } from "../types/teams.type";

type UseTeamsFiltersResult = {
    filtered: TeamType[];
    deptCount: number;
    thisMonth: number;
};

export function useTeamsFilters(
    teams: TeamType[],
    search: string,
    skipClientSearch: boolean
): UseTeamsFiltersResult {
    const normalized = search.trim().toLowerCase();

    const filtered = useMemo(() => {
        if (skipClientSearch) return teams;
        if (!normalized) return teams;

        return teams.filter((t) => {
            const ownerName = `${t.owner?.first_name ?? ""} ${t.owner?.last_name ?? ""}`.toLowerCase();
            const deptName = (t.department?.name ?? "").toLowerCase();

            return (
                t.name.toLowerCase().includes(normalized) ||
                (t.description ?? "").toLowerCase().includes(normalized) ||
                ownerName.includes(normalized) ||
                deptName.includes(normalized)
            );
        });
    }, [teams, normalized, skipClientSearch]);

    const deptCount = useMemo(() => {
        const set = new Set<number>();
        filtered.forEach((t) => {
            if (t.department?.id) set.add(t.department.id);
        });
        return set.size;
    }, [filtered]);

    const thisMonth = useMemo(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth();
        return filtered.filter((t) => {
            const d = new Date(t.created_at);
            return d.getFullYear() === y && d.getMonth() === m;
        }).length;
    }, [filtered]);

    return { filtered, deptCount, thisMonth };
}
