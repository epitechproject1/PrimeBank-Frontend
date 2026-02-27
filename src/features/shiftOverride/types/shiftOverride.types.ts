// ./features/planning/shift-override/types/shiftOverride.types.ts

// ==============================
// MODEL
// ==============================

import { Shift } from "../../shift/types/shift.types";

// 🔹 Enum aligné avec Django TextChoices
export type ShiftOverrideReasonCode =
    | "SICK"
    | "LEAVE"
    | "TRAINING"
    | "MEETING"
    | "CANCELLED"
    | "OTHER";

export interface ShiftOverride {
    id: number;

    shift: number;
    shift_detail?: Shift;

    new_start_time?: string | null; // HH:mm:ss
    new_end_time?: string | null;   // HH:mm:ss

    cancelled: boolean;

    // ✅ nouveau modèle
    reason_code?: ShiftOverrideReasonCode | null;
    reason_note?: string;

    created_at: string;
}

// ==============================
// PAYLOADS
// ==============================

export interface CreateShiftOverridePayload {
    shift: number;

    new_start_time?: string | null; // HH:mm:ss
    new_end_time?: string | null;   // HH:mm:ss

    cancelled?: boolean;

    reason_code?: ShiftOverrideReasonCode | null;
    reason_note?: string;
}

export type UpdateShiftOverridePayload = Partial<CreateShiftOverridePayload>;

// ==============================
// FILTERS
// ==============================

export interface ShiftOverrideFilters {
    shift?: number;
    cancelled?: boolean;
}