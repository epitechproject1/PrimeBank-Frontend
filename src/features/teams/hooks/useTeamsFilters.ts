import { useMemo } from "react";
import { TeamType } from "../types/teams.type";

export function useTeamsFilters(
    teams: TeamType[] | any, // Accepter aussi un objet
    search: string,
    useBackendSearch: boolean = false
) {
    // Normaliser teams en tableau
    const teamsArray = useMemo(() => {
        if (!teams) return [];
        if (Array.isArray(teams)) return teams;
        // Si teams est un objet avec data
        if (teams.data && Array.isArray(teams.data)) return teams.data;
        return [];
    }, [teams]);

    const filtered = useMemo(() => {
        if (useBackendSearch) {
            return teamsArray;
        }

        const searchLower = search.toLowerCase().trim();

        if (!searchLower) {
            return teamsArray;
        }

        return teamsArray.filter((t: { name: string; description: any; department: { name: any; }; owner: { first_name: any; last_name: any; }; }) =>
            t.name.toLowerCase().includes(searchLower) ||
            (t.description ?? "").toLowerCase().includes(searchLower) ||
            (t.department?.name ?? "").toLowerCase().includes(searchLower) ||
            (t.owner?.first_name ?? "").toLowerCase().includes(searchLower) ||
            (t.owner?.last_name ?? "").toLowerCase().includes(searchLower)
        );
    }, [teamsArray, search, useBackendSearch]);

    const deptCount = useMemo(() => {
        if (!Array.isArray(teamsArray)) return 0;

        return new Set(
            teamsArray
                .map((t) => t.department?.id)
                .filter((id): id is number => Boolean(id))
        ).size;
    }, [teamsArray]);

    const thisMonth = useMemo(() => {
        if (!Array.isArray(teamsArray)) return 0;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return teamsArray.filter((t) => {
            const created = new Date(t.created_at);
            return (
                created.getMonth() === currentMonth &&
                created.getFullYear() === currentYear
            );
        }).length;
    }, [teamsArray]);

    return { filtered, deptCount, thisMonth };
}