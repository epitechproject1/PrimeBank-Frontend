import { useCallback } from "react";
import { message } from "antd";
import type { ScheduleAssignment } from "../types/scheduleAssignment.types";
import * as scheduleAssignmentService from "../services/scheduleAssignments.service";
import {getErrorMessage} from "../types/errorUtils.ts";


export function useGenerateShifts(
    setAssignments: (updater: (prev: ScheduleAssignment[]) => ScheduleAssignment[]) => void
) {
    return useCallback(
        async (id: number, includeHolidays = false) => {
            try {
                const res =
                    await scheduleAssignmentService.generateShiftsForAssignment(id, {
                        include_holidays: includeHolidays,
                    });

                message.success(`${res.created_shifts} shifts générés`);

                setAssignments((prev: ScheduleAssignment[]) =>
                    prev.map((a) =>
                        a.id === id ? { ...a, last_generated_at: new Date().toISOString() } : a
                    )
                );

                return res;
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur génération planning"));
                throw err;
            }
        },
        [setAssignments]
    );
}