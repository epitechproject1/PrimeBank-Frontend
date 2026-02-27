// ./features/planning/types/shift.types.ts

import type { User } from "../../users";
import type { ScheduleAssignment } from "../../scheduleAssignment/types/scheduleAssignment.types";
import type { ShiftOverrideReasonCode } from "../../shiftOverride/types/shiftOverride.types";

// ==============================
// ENUMS
// ==============================

/**
 * Doit correspondre EXACTEMENT aux valeurs backend.
 */
export type ShiftType =
    | "WORK"
    | "BREAK"

// ==============================
// MODEL
// ==============================

export interface Shift {
    id: number;

    // ───────── RELATIONS ─────────
    user: number;
    user_detail?: User;

    assignment: number;
    assignment_detail?: ScheduleAssignment;

    // ───────── DATE ─────────
    /**
     * Format: YYYY-MM-DD
     */
    date: string;

    /**
     * Format: HH:mm:ss
     */
    start_time: string | null;
    end_time: string | null;

    // ───────── TYPE ─────────
    shift_type: ShiftType;
    shift_type_display: string;

    // ───────── OVERRIDE STATE ─────────
    overridden: boolean;

    /**
     * true si override cancelled
     */
    cancelled?: boolean;

    /**
     * code enum venant du backend
     */
    override_reason?: ShiftOverrideReasonCode | null;

    /**
     * commentaire override
     */
    override_note?: string | null;

    // ───────── META ─────────
    created_at: string;
}

// ==============================
// PAYLOADS
// ==============================

export interface CreateShiftPayload {
    user: number;
    assignment: number;

    /**
     * Format: YYYY-MM-DD
     */
    date: string;

    /**
     * Format: HH:mm:ss
     */
    start_time?: string | null;
    end_time?: string | null;

    shift_type: ShiftType;

    overridden?: boolean;
}

export type UpdateShiftPayload = Partial<CreateShiftPayload>;

// ==============================
// FILTERS
// ==============================

export interface ShiftFilters {
    page?: number;
    page_size?: number;
    search?: string;
    user?: number;
    date_from?: string;
    date_to?: string;
}