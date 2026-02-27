import { useCallback } from "react";
import { message } from "antd";
import type { ScheduleAssignment, CreateScheduleAssignmentPayload } from "../types/scheduleAssignment.types";
import * as scheduleAssignmentService from "../services/scheduleAssignments.service";
import {getErrorMessage} from "../types/errorUtils.ts";

export function useCreateAssignment(
    setAssignments: (updater: (prev: ScheduleAssignment[]) => ScheduleAssignment[]) => void,
    setTotal: (updater: (prev: number) => number) => void
) {
    return useCallback(
        async (payload: CreateScheduleAssignmentPayload) => {
            try {
                const created = await scheduleAssignmentService.createScheduleAssignment(payload);

                setAssignments((prev: ScheduleAssignment[]) => [created, ...prev]);
                setTotal((t: number) => t + 1);

                message.success("Affectation créée");
                return created;
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur création"));
                throw err;
            }
        },
        [setAssignments, setTotal]
    );
}