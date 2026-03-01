// src/features/attendance/hooks/useAttendanceKPIs.ts

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api_client/apiClient";

export interface AttendanceKPIFilters {
    date_from?: string;
    date_to?: string;
    user?: number;
    team?: number;
    department?: number;
}

export interface AttendanceKPIData {
    planned_shifts: number;
    worked_shifts: number;
    attendance_rate: number;
    late_count: number;
    worked_seconds: number;
    incomplete_shifts: number;
    missed_shifts: number;
    today_status: "COMPLETED" | "IN_PROGRESS" | "PLANNED" | null;
}

async function fetchAttendanceKPIs(filters: AttendanceKPIFilters): Promise<AttendanceKPIData> {
    const params: Record<string, string | number> = {};

    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    if (filters.user !== undefined) params.user = filters.user;
    if (filters.team !== undefined) params.team = filters.team;
    if (filters.department !== undefined) params.department = filters.department;

    const res = await apiClient.get<AttendanceKPIData>("/kpis/", { params });
    return res.data;
}

export function useAttendanceKPIs(filters: AttendanceKPIFilters) {
    return useQuery({
        queryKey: ["attendance-kpis", filters],
        queryFn: () => fetchAttendanceKPIs(filters),
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });
}