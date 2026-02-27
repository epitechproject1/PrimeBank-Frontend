import type {
    CreateScheduleAssignmentPayload,
    UpdateScheduleAssignmentPayload,
} from "../types/scheduleAssignment.types";

import { useScheduleAssignmentsUIState } from "./useScheduleAssignmentsUIState";
import {useScheduleAssignmentsDerived} from "./ useScheduleAssignmentsDerived.ts";
import {useScheduleAssignmentsData} from "./useScheduleAssignmentsData.ts";

export function useScheduleAssignmentsManagerPageLogic() {
    const data = useScheduleAssignmentsData();

    const ui = useScheduleAssignmentsUIState(data.assignments);

    const derived = useScheduleAssignmentsDerived(
        data.assignments,
        ui.selected,
        ui.filterActive
    );

    const handleDelete = async (id: number) => {
        await data.deleteAssignment(id);
        ui.closeDetail();
    };

    const handleModalSubmit = async (
        payload: CreateScheduleAssignmentPayload | UpdateScheduleAssignmentPayload,
        id?: number
    ) => {
        if (id) {
            await data.updateAssignment(id, payload);
        } else {
            await data.createAssignment(payload as CreateScheduleAssignmentPayload);
        }
    };

    return {
        ...data,
        ...ui,
        ...derived,
        handleDelete,
        handleModalSubmit,
    };
}