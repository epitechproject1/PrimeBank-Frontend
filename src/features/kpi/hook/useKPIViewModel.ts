// src/features/attendance/hooks/useKPIViewModel.ts

import { useMemo } from "react";

export function getAttendanceColor(rate?: number) {
    if (rate == null) return undefined;
    if (rate >= 80) return "#52c41a";
    if (rate >= 50) return "#faad14";
    return "#ff4d4f";
}

export function fmtSeconds(s: number): string {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function useKPIViewModel(data: any, filters: any) {
    const attendanceColor = getAttendanceColor(data?.attendance_rate);

    const kpis = useMemo(() => [
        { label: "Shifts planifiés", value: data?.planned_shifts ?? 0 },
        { label: "Shifts travaillés", value: data?.worked_shifts ?? 0 },
        { label: "Taux de présence", value: data?.attendance_rate ?? 0, suffix: "%" },
        { label: "Retards", value: data?.late_count ?? 0 },
        { label: "Temps travaillé", value: data ? fmtSeconds(data.worked_seconds) : "—" },
        { label: "Incomplets", value: data?.incomplete_shifts ?? 0 },
        { label: "Manqués", value: data?.missed_shifts ?? 0 },
    ], [data]);

    const hasFilters = Object.values(filters).some(Boolean);

    return { kpis, attendanceColor, hasFilters };
}