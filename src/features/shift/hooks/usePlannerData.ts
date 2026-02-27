import { useShiftsData } from "../hooks/useShifts";
import { useShiftOverridesData } from "../../shiftOverride/hooks/useShiftOverrides";
import { useScheduleAssignmentsData } from "../../scheduleAssignment/hooks/useScheduleAssignmentsData";
import { useUsersFromShifts } from "../hooks/useUsersFromShifts";

export function usePlannerData() {
    const shiftsData = useShiftsData();
    const overridesData = useShiftOverridesData();
    const assignmentsData = useScheduleAssignmentsData();

    const users = useUsersFromShifts(shiftsData.shifts);

    return {
        ...shiftsData,
        ...overridesData,
        ...assignmentsData,
        users,
    };
}