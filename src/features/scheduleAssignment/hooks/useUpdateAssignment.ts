import { useCallback } from "react";
import { message } from "antd";
import type { ScheduleAssignment, UpdateScheduleAssignmentPayload } from "../types/scheduleAssignment.types";
import * as scheduleAssignmentService from "../services/scheduleAssignments.service";
import {getErrorMessage} from "../types/errorUtils.ts";

export function useUpdateAssignment(
    assignmentsRef: React.MutableRefObject<ScheduleAssignment[]>,
    setAssignments: (updater: (prev: ScheduleAssignment[]) => ScheduleAssignment[]) => void
) {
    return useCallback(
        async (id: number, payload: UpdateScheduleAssignmentPayload) => {
            const snapshot = assignmentsRef.current;

            setAssignments((prev: ScheduleAssignment[]) =>
                prev.map((a) => (a.id === id ? { ...a, ...payload } : a))
            );

            try {
                const updated = await scheduleAssignmentService.updateScheduleAssignment(
                    id,
                    payload
                );

                setAssignments((prev: ScheduleAssignment[]) =>
                    prev.map((a) => (a.id === id ? updated : a))
                );

                message.success("Affectation mise à jour");
                return updated;
            } catch (err) {
                setAssignments(() => snapshot);
                message.error(getErrorMessage(err, "Erreur mise à jour"));
                throw err;
            }
        },
        [assignmentsRef, setAssignments]
    );
}