// src/features/shift/utils/shiftToCalendarEvent.ts

import dayjs from "dayjs";
import { ClockStatus } from "./Clockstatus";
import { CalendarEvent } from "./calendarEvent";
import { Shift } from "../../shift/types/shift.types";

// ─── couleurs par statut ─────────────────────────────────────────────────────
const STATUS_COLORS: Record<
    ClockStatus,
    { bg: string; border: string; text: string }
> = {
    NOT_STARTED: { bg: "#e6f4ff", border: "#91caff", text: "#0958d9" },
    CLOCK_IN_PENDING: { bg: "#fffbe6", border: "#ffd666", text: "#ad6800" },
    IN_PROGRESS: { bg: "#f6ffed", border: "#95de64", text: "#237804" },
    CLOCK_OUT_PENDING: { bg: "#fff7e6", border: "#ffc069", text: "#ad4e00" },
    COMPLETED: { bg: "#f9f0ff", border: "#d3adf7", text: "#531dab" },
};

// couleurs atténuées pour les shifts qui ne sont pas aujourd'hui
const PAST_COLORS = { bg: "#fafafa", border: "#d9d9d9", text: "#bfbfbf" };
const FUTURE_COLORS = { bg: "#fafafa", border: "#d9d9d9", text: "#8c8c8c" };

export function shiftToCalendarEvent(shift: Shift): CalendarEvent {
    const today = dayjs().format("YYYY-MM-DD");
    const isToday = shift.date === today;
    const isPast = dayjs(shift.date).isBefore(dayjs(), "day");

    const status = (shift.clock_status as ClockStatus) ?? "NOT_STARTED";

    let colors;

    if (isToday) {
        colors = STATUS_COLORS[status];
    } else if (isPast) {
        colors = PAST_COLORS;
    } else {
        colors = FUTURE_COLORS;
    }

    const start = `${shift.date}T${shift.start_time ?? "00:00:00"}`;
    const end = `${shift.date}T${shift.end_time ?? "00:00:00"}`;

    const assignmentName = (shift as any).assignment?.week_pattern?.name ?? null;
    const title = assignmentName ?? "Shift";

    return {
        id: String(shift.id),
        title,
        start,
        end,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        textColor: colors.text,
        classNames: [
            "fc-shift-event",
            isToday ? "fc-shift-today" : "",
            isPast ? "fc-shift-past" : "fc-shift-future",
            `fc-shift-status-${status.toLowerCase().replace("_", "-")}`,
        ].filter(Boolean),
        extendedProps: {
            shiftId: shift.id,
            isToday,
            clockStatus: status,
            assignmentName,
        },
    };
}

export function shiftsToCalendarEvents(shifts: Shift[]): CalendarEvent[] {
    return shifts.map(shiftToCalendarEvent);
}