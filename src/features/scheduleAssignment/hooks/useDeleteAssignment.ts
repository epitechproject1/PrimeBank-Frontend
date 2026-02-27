import { useCallback } from "react";
import { message } from "antd";
import type { ScheduleAssignment } from "../types/scheduleAssignment.types";
import * as scheduleAssignmentService from "../services/scheduleAssignments.service";
import {getErrorMessage} from "../types/errorUtils.ts";


export function useDeleteAssignment(
    assignmentsRef: React.MutableRefObject<ScheduleAssignment[]>,
    setAssignments: (updater: (prev: ScheduleAssignment[]) => ScheduleAssignment[]) => void,
    setTotal: (updater: (prev: number) => number) => void
) {
    return useCallback(async (id: number) => {
        const snapshot = assignmentsRef.current;

        setAssignments((prev: ScheduleAssignment[]) => prev.filter((a) => a.id !== id));
        setTotal((t: number) => Math.max(0, t - 1));

        try {
            await scheduleAssignmentService.deleteScheduleAssignment(id);
            message.success("Affectation supprimée");
        } catch (err) {
            setAssignments(() => snapshot);
            setTotal((t: number) => t + 1);
            message.error(getErrorMessage(err, "Erreur suppression"));
            throw err;
        }
    }, [assignmentsRef, setAssignments, setTotal]);
}