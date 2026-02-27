import { useState, useMemo } from "react";
import type { FormInstance } from "antd";

import { usePlannerEvents } from "./usePlannerEvents";
import { usePlannerModals } from "./usePlannerModals";
import {Shift} from "../../types/shift.types.ts";
import {ShiftOverride} from "../../../shiftOverride/types/shiftOverride.types.ts";
import {ScheduleAssignment} from "../../../scheduleAssignment/types/scheduleAssignment.types.ts";
import {ShiftFormValues} from "../../schemas/shift.schema.ts";

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