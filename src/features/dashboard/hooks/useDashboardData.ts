import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { departmentService } from "../../departments/services/departments.service";
import type {
    DepartmentStats,
    DepartmentStatsBreakdownRow,
} from "../../departments/types/departments.type";
import { teamService } from "../../teams/services/teams.service";
import type { TeamStats, TeamType } from "../../teams/types/teams.type";
import { pctChange } from "../constants/dashboard.utils";
import { CHART_COLORS } from "../constants/dashboard.constants";
export function useCurrentTime() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 60_000);
        return () => clearInterval(id);
    }, []);
    return time;
}
export function useDashboardData() {
    const { data: deptStats, isLoading: loadingDeptStats, error: deptStatsError } =
        useQuery<DepartmentStats>({
            queryKey: ["departments", "stats"],
            queryFn: departmentService.stats,
            staleTime: 30_000,
            retry: false,
        });

    const { data: deptBreakdown, isLoading: loadingDeptBreakdown, error: deptBreakdownError } =
        useQuery<DepartmentStatsBreakdownRow[]>({
            queryKey: ["departments", "stats-breakdown"],
            queryFn: departmentService.statsBreakdown,
            staleTime: 30_000,
            retry: false,
        });

    const { data: teamStats, isLoading: loadingTeamStats, error: teamStatsError } =
        useQuery<TeamStats>({
            queryKey: ["teams", "stats"],
            queryFn: teamService.stats,
            staleTime: 30_000,
            retry: false,
        });

    const { data: myTeamsResp, isLoading: loadingMyTeams } = useQuery({
        queryKey: ["teams", "my-teams"],
        queryFn: () => teamService.getMyTeams(),
        staleTime: 30_000,
        retry: false,
    });

    const myTeams: TeamType[] = myTeamsResp?.data ?? [];

    const deptTotal = deptStats?.total_departments ?? 0;
    const teamsTotal = teamStats?.total_teams ?? 0;
    const deptCreated = deptStats?.this_month_count ?? 0;
    const teamsCreated = teamStats?.this_month_count ?? 0;

    const totalMembers = useMemo(
        () => (deptBreakdown ?? []).reduce((acc, row) => acc + (row.members_count ?? 0), 0),
        [deptBreakdown],
    );

    const kpiValues = useMemo(() => ({
        depts: {
            value: deptTotal,
            sublabel: `+${deptCreated} ce mois-ci`,
            trend: pctChange(deptTotal, Math.max(deptTotal - deptCreated, 1)),
            loading: loadingDeptStats,
            error: Boolean(deptStatsError),
        },
        teams: {
            value: teamsTotal,
            sublabel: `+${teamsCreated} ce mois-ci`,
            trend: pctChange(teamsTotal, Math.max(teamsTotal - teamsCreated, 1)),
            loading: loadingTeamStats,
            error: Boolean(teamStatsError),
        },
        myTeams: {
            value: teamStats?.user_teams_count ?? 0,
            sublabel: "Lié au compte connecté",
            loading: loadingTeamStats,
        },
        members: {
            value: totalMembers,
            sublabel: "Tous départements confondus",
            loading: loadingDeptBreakdown,
        },
    }), [
        deptTotal, teamsTotal, deptCreated, teamsCreated, teamStats, totalMembers,
        loadingDeptStats, loadingTeamStats, loadingDeptBreakdown,
        deptStatsError, teamStatsError,
    ]);

    const teamsByDepartmentBar = useMemo(
        () => (teamStats?.teams_by_department ?? []).map((r) => ({
            department: r.department__name ?? "Sans département",
            équipes: r.count,
        })),
        [teamStats],
    );

    const teamsByDepartmentPie = useMemo(() => {
        const rows = teamStats?.teams_by_department ?? [];
        const total = rows.reduce((a, r) => a + (r.count ?? 0), 0) || 1;
        return rows.map((r, i) => ({
            name: r.department__name ?? "Sans département",
            value: r.count,
            color: CHART_COLORS[i % CHART_COLORS.length],
            pct: (r.count / total) * 100,
        }));
    }, [teamStats]);

    return {
        deptBreakdown,
        myTeams,
        loadingDeptStats,
        loadingDeptBreakdown,
        loadingTeamStats,
        loadingMyTeams,
        anyError: Boolean(deptStatsError || deptBreakdownError || teamStatsError),
        kpiValues,
        teamsByDepartmentBar,
        teamsByDepartmentPie,
    };
}