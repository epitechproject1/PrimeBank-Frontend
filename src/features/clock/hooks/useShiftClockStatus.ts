import { ClockEvent } from "../services/clockEvents.service";

export type ShiftClockStatus =
    | "NOT_STARTED"
    | "CLOCK_IN_PENDING"
    | "IN_PROGRESS"
    | "CLOCK_OUT_PENDING"
    | "COMPLETED";

export function getShiftClockStatus(
    shiftId: number,
    events: ClockEvent[]
): ShiftClockStatus {
    const shiftEvents = events.filter((e) => e.shift === shiftId);

    const clockIn = shiftEvents.find((e) => e.event_type === "CLOCK_IN");
    const clockOut = shiftEvents.find((e) => e.event_type === "CLOCK_OUT");

    if (!clockIn) return "NOT_STARTED";

    if (clockIn.status === "PENDING") return "CLOCK_IN_PENDING";

    if (clockIn.status === "APPROVED" && !clockOut) return "IN_PROGRESS";

    if (clockOut && clockOut.status === "PENDING")
        return "CLOCK_OUT_PENDING";

    if (clockOut && clockOut.status === "APPROVED") return "COMPLETED";

    return "NOT_STARTED";
}