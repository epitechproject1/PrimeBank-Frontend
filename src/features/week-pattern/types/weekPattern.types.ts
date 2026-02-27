// ./features/planning/types/weekPattern.types.ts
import {
    CreateTimeSlotPatternPayload,
    SlotType,
    TimeSlotPattern, WeekDay
} from "../../TimeSlotPattern/types/timeSlotPattern.types.ts";
import type dayjs from "dayjs";
// ==============================
// MODEL
// ==============================

export interface WeekPattern {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    time_slots: TimeSlotPattern[];
    created_at: string;
    updated_at: string;

    // Calculé backend
    total_hours?: number;
    slots_count?: number;
}


export type TimeSlotFormValues = {
    week_pattern: number;
    weekday: WeekDay;
    start_time: dayjs.Dayjs;
    end_time: dayjs.Dayjs;
    slot_type: SlotType;
};


export type WeekdayDef = {
    key: WeekDay;
    label: string;
    short: string;
    color: string;
};

export const WEEKDAYS: WeekdayDef[] = [
    { key: 0, label: "Lundi", short: "Lun", color: "#1677ff" },
    { key: 1, label: "Mardi", short: "Mar", color: "#1677ff" },
    { key: 2, label: "Mercredi", short: "Mer", color: "#1677ff" },
    { key: 3, label: "Jeudi", short: "Jeu", color: "#1677ff" },
    { key: 4, label: "Vendredi", short: "Ven", color: "#1677ff" },
    { key: 5, label: "Samedi", short: "Sam", color: "#fa8c16" },
    { key: 6, label: "Dimanche", short: "Dim", color: "#ff4d4f" },
];

// ==============================
// PAYLOADS
// ==============================

export interface CreateWeekPatternPayload {
    name: string;
    description?: string;
    is_active?: boolean;
    time_slots?: Omit<CreateTimeSlotPatternPayload, "week_pattern">[];
}

export type UpdateWeekPatternPayload = Partial<CreateWeekPatternPayload>;

// ==============================
// FILTERS
// ==============================

export interface WeekPatternFilters {
    is_active?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
}

function getSlotDuration(slot: TimeSlotPattern) {
    const start = new Date(`1970-01-01T${slot.start_time}`);
    const end = new Date(`1970-01-01T${slot.end_time}`);
    return (end.getTime() - start.getTime()) / 1000 / 60 / 60;
}

export function getWeekWorkHours(slots: TimeSlotPattern[]) {
    return slots
        .filter((s) => s.slot_type === "WORK")
        .reduce((acc, s) => acc + getSlotDuration(s), 0);
}