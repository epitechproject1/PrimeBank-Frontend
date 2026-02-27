import { useMemo } from "react";
import {Shift} from "../../types/shift.types.ts";
import {ShiftOverride} from "../../../shiftOverride/types/shiftOverride.types.ts";
import {shiftToEvent} from "../../utils/shiftToEvent.ts";
import {CalendarEvent} from "../../componnents/calendarEvent.ts";

function applyOverride(shift: Shift, overrides: ShiftOverride[]): Shift {
    const override = overrides.find((o) => o.shift === shift.id);
    if (!override) return shift;

    return {
        ...shift,
        start_time: override.cancelled
            ? shift.start_time
            : override.new_start_time ?? shift.start_time,
        end_time: override.cancelled
            ? shift.end_time
            : override.new_end_time ?? shift.end_time,
        overridden: true,
        shift_type: override.cancelled ? "BREAK" : shift.shift_type,
    };
}

export function usePlannerEvents(
    shifts: Shift[],
    overrides: ShiftOverride[],
    selectedUser: number | null
) {
    const filteredShifts = useMemo(() => {
        if (selectedUser === null) return shifts;
        return shifts.filter((s) => s.user === selectedUser);
    }, [shifts, selectedUser]);

    return useMemo<CalendarEvent[]>(() => {
        return filteredShifts.map((shift) => {
            const merged = applyOverride(shift, overrides);
            return shiftToEvent(merged, shift);
        });
    }, [filteredShifts, overrides]);
}