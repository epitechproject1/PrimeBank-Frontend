import { useCallback } from "react";
import { message } from "antd";
import type { ScheduleAssignment } from "../types/scheduleAssignment.types";
import * as scheduleAssignmentService from "../services/scheduleAssignments.service";
import {getErrorMessage} from "../types/errorUtils.ts";

export function useFetchAssignments(
    page: number,
    search: string,
    setAssignments: (updater: ScheduleAssignment[] | ((prev: ScheduleAssignment[]) => ScheduleAssignment[])) => void,
    setLoading: (loading: boolean) => void,
    setTotal: (total: number) => void
) {
    return useCallback(async () => {
        setLoading(true);
        try {
            const res = await scheduleAssignmentService.getScheduleAssignments({
                page,
                search,
            });

            setAssignments(res.results);
            setTotal(res.count);
        } catch (err) {
            message.error(getErrorMessage(err, "Erreur chargement affectations"));
        } finally {
            setLoading(false);
        }
    }, [page, search, setAssignments, setLoading, setTotal]);
}