import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flex, Alert } from "antd";
import { apiClient } from "../../../../lib/api_client/apiClient.ts";

import { buildStats, DEFAULT_COLORS } from "./departmentsStats.builders";
import type { StatsApiResponse, StatsColors, UserRole } from "./departmentsStats.builders";
import {KpiCard} from "./Departmentsstatscard.tsx";

interface DepartmentsStatsProps {
    role: UserRole;
    colors?: Partial<StatsColors>;
    onError?: (error: string) => void;
}

async function fetchDepartmentStats(): Promise<StatsApiResponse> {
    const res = await apiClient.get<StatsApiResponse>("/departments/stats/");
    return res.data;
}

const SKELETON_STAT = { title: "", value: 0, icon: null, color: "#1677ff", sublabel: "", barPct: 0 };

export function DepartmentsStats({ role, colors = DEFAULT_COLORS, onError }: DepartmentsStatsProps) {
    const enabled = role !== "EMPLOYEE";

    const { data, isLoading, error } = useQuery({
        queryKey: ["departments", "stats"],
        queryFn: fetchDepartmentStats,
        enabled,
        staleTime: 30_000,
        retry: 1,
    });

    const errorMessage = error ? (error as Error).message : null;

    useEffect(() => {
        if (errorMessage) onError?.(errorMessage);
    }, [errorMessage, onError]);

    const stats = useMemo(
        () => buildStats(role, colors, data ?? null),
        [role, colors, data],
    );

    if (role === "EMPLOYEE") return null;

    if (errorMessage && !isLoading) {
        return (
            <Alert
                type="warning"
                message="Impossible de charger les statistiques"
                description={errorMessage}
                showIcon
                style={{ borderRadius: 8 }}
            />
        );
    }

    const skeletonCount = role === "MANAGER" ? 3 : 4;

    return (
        <Flex gap={12} wrap="wrap" role="region" aria-label="Statistiques des départements">
            {isLoading
                ? Array.from({ length: skeletonCount }).map((_, i) => (
                    <KpiCard key={i} loading stat={SKELETON_STAT} />
                ))
                : stats.map((stat) => (
                    <KpiCard key={stat.title} stat={stat} loading={false} />
                ))
            }
        </Flex>
    );
}

export default DepartmentsStats;