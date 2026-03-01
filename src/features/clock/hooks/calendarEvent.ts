// src/features/shift/types/calendarEvent.ts

export type ClockStatus =
    | "NOT_STARTED"
    | "CLOCK_IN_PENDING"
    | "IN_PROGRESS"
    | "CLOCK_OUT_PENDING"
    | "COMPLETED";

export interface CalendarEventExtended {
    shiftId: number;
    isToday: boolean;
    clockStatus: ClockStatus;
    assignmentName: string | null;
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: string;          // ISO datetime
    end: string;            // ISO datetime
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    classNames?: string[];
    extendedProps: CalendarEventExtended;
}