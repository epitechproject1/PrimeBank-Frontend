import { useState, useMemo } from "react";
import type { FormInstance } from "antd";
import type { Shift } from "../types/shift.types";
import type { ShiftOverride } from "../../shiftOverride/types/shiftOverride.types";
import type { ScheduleAssignment } from "../../scheduleAssignment/types/scheduleAssignment.types";
import type { ShiftFormValues } from "../schemas/shift.schema";
import {usePlannerEvents} from "./usePlannerState/usePlannerEvents.ts";
import {usePlannerModals} from "./usePlannerState/usePlannerModals.ts";

export function usePlannerState(
    shifts: Shift[],
    overrides: ShiftOverride[],
    users: { id: number; name: string }[],
    assignments: ScheduleAssignment[],
    form: FormInstance<ShiftFormValues>
) {
    const [selectedUser, setSelectedUser] = useState<number | null>(null);

    const events = usePlannerEvents(shifts, overrides, selectedUser);

    const selectedUserName = useMemo(() => {
        if (selectedUser === null) return "Global";
        return users.find((u) => u.id === selectedUser)?.name ?? "Global";
    }, [selectedUser, users]);

    const modals = usePlannerModals(assignments, selectedUser, form);

    return {
        selectedUser,
        setSelectedUser,
        selectedUserName,
        events,
        ...modals,
    };
}