// ./features/planning/types/timeSlotPattern.types.ts
import {WeekPattern} from "../../week-pattern/types/weekPattern.types.ts";

// ==============================
// MODEL
// ==============================
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;


export interface TimeSlotPattern {
    id: number;
    week_pattern: number | WeekPattern;
    weekday: WeekDay;
    start_time: string;
    end_time: string;
    slot_type: SlotType;

    // Calculé frontend
    weekday_label?: string;
    slot_type_label?: string;
    slot_type_color?: string;
    duration_hours?: number;
    duration_display?: string;
}

// ==============================
// PAYLOADS
// ==============================

export interface CreateTimeSlotPatternPayload {
    week_pattern: number;
    weekday: WeekDay;
    start_time: string;
    end_time: string;
    slot_type: SlotType;
}

export type UpdateTimeSlotPatternPayload =
    Partial<CreateTimeSlotPatternPayload>;
// ==============================
// FILTERS
// ==============================

export interface TimeSlotFilters {
    week_pattern?: number;
    weekday?: WeekDay;
    slot_type?: SlotType;
}

export enum SlotType {
    WORK = "WORK",
    BREAK = "BREAK"
}

export const SlotTypeLabels: Record<SlotType, string> = {
    [SlotType.WORK]: "Travail",
    [SlotType.BREAK]: "Pause",
};

export const SlotTypeColors: Record<SlotType, string> = {
    [SlotType.WORK]: "blue",
    [SlotType.BREAK]: "orange",
};

export const WEEKDAY_OPTIONS = [
    { value: 0, label: "Lundi" },
    { value: 1, label: "Mardi" },
    { value: 2, label: "Mercredi" },
    { value: 3, label: "Jeudi" },
    { value: 4, label: "Vendredi" },
    { value: 5, label: "Samedi" },
    { value: 6, label: "Dimanche" },
];

export const SLOT_TYPE_OPTIONS = [
    { value: SlotType.WORK, label: "Travail" },
    { value: SlotType.BREAK, label: "Pause" },
];