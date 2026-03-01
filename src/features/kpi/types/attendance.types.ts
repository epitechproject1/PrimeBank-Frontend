export interface AttendanceKPI {
    planned_shifts: number;
    worked_shifts: number;
    attendance_rate: number;

    late_count: number;

    worked_seconds: number;

    incomplete_shifts: number;
    missed_shifts: number;

    today_status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | null;
}

export interface AttendanceKPIParams {
    date_from?: string; // YYYY-MM-DD
    date_to?: string;
    user?: number;
    team?: number;
    department?: number;
}