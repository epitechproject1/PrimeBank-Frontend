import { useMemo } from "react";
import type { ScheduleAssignment } from "../types/scheduleAssignment.types";

export function useScheduleAssignmentsDerived(
    assignments: ScheduleAssignment[],
    selected: ScheduleAssignment | null,
    filterActive: boolean | null
) {
    const filtered = useMemo(() => {
        if (filterActive === null) return assignments;
        return assignments.filter((a) => a.is_active === filterActive);
    }, [assignments, filterActive]);

    const stats = useMemo(
        () => ({
            total: assignments.length,
            active: assignments.filter((a) => a.is_active).length,
            inactive: assignments.filter((a) => !a.is_active).length,
        }),
        [assignments]
    );

    const liveSelected = selected
        ? assignments.find((a) => a.id === selected.id) ?? selected
        : null;

    return { filtered, stats, liveSelected };
}