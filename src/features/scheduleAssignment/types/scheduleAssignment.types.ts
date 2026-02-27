import type { WeekPattern } from "../../week-pattern/types/weekPattern.types";
import type { Contract } from "../../contract/types/contract.types";

// ==============================
// MODEL
// ==============================


export interface ScheduleAssignment {
    id: number;

    // FK
    contract: number;
    contract_detail?: Contract;

    // FK
    week_pattern: number;
    week_pattern_detail?: WeekPattern;

    // dates ISO
    start_date: string;        // YYYY-MM-DD
    end_date: string | null;   // ✅ nullable car backend peut renvoyer null

    is_active: boolean;

    created_at: string;        // ISO datetime
}


// ==============================
// PAYLOADS
// ==============================

export interface CreateScheduleAssignmentPayload {
    contract: number;
    week_pattern: number;

    start_date: string;
    end_date?: string | null;

    is_active?: boolean;
}

export type UpdateScheduleAssignmentPayload =
    Partial<CreateScheduleAssignmentPayload>;

// ==============================
// FILTERS
// ==============================

export interface ScheduleAssignmentFilters {
    page?: number;
    page_size?: number;
    search?: string;
}