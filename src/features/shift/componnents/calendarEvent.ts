import type { EventInput } from "@fullcalendar/core";
import type { Shift } from "../types/shift.types";

export interface CalendarEvent extends EventInput {
    id: string;
    extendedProps: {
        shift: Shift;
        originalShift?: Shift;
    };
}