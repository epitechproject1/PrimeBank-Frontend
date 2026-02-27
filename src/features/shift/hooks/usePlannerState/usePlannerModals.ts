import { useState } from "react";
import dayjs from "dayjs";
import type { FormInstance } from "antd";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import {ScheduleAssignment} from "../../../scheduleAssignment/types/scheduleAssignment.types.ts";
import {Shift} from "../../types/shift.types.ts";
import {ShiftFormValues} from "../../schemas/shift.schema.ts";


type ModalMode = "create" | "edit";

function findAssignment(
    assignments: ScheduleAssignment[],
    userId: number | null,
    date: string
) {
    if (!userId) return undefined;

    return assignments.find((a) => {
        const contractUserId = a.contract_detail?.user_detail?.id
            ? Number(a.contract_detail.user_detail.id)
            : undefined;

        if (contractUserId !== userId) return false;
        if (a.start_date > date) return false;
        if (a.end_date && a.end_date < date) return false;

        return true;
    })?.id;
}

export function usePlannerModals(
    assignments: ScheduleAssignment[],
    selectedUser: number | null,
    form: FormInstance<ShiftFormValues>
) {
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>("create");

    const handleDateSelect = (info: DateSelectArg) => {
        const start = dayjs(info.startStr);
        const end = dayjs(info.endStr);
        const dateStr = start.format("YYYY-MM-DD");

        const assignmentId = findAssignment(assignments, selectedUser, dateStr);

        setModalMode("create");
        setModalOpen(true);

        form.setFieldsValue({
            date: start,
            start_time: start,
            end_time: end,
            shift_type: "WORK",
            user: selectedUser ?? undefined,
            assignment: assignmentId,
        });
    };

    const openEditModal = (shift: Shift) => {
        setSelectedShift(shift);
        setModalMode("edit");
        setModalOpen(true);

        form.setFieldsValue({
            assignment: shift.assignment,
            user: shift.user,
            date: dayjs(shift.date),
            shift_type: shift.shift_type,
            start_time: shift.start_time
                ? dayjs(shift.start_time, "HH:mm:ss")
                : null,
            end_time: shift.end_time
                ? dayjs(shift.end_time, "HH:mm:ss")
                : null,
        });
    };

    const handleEventClick = (info: EventClickArg) => {
        const shift = (info.event.extendedProps as { shift?: Shift }).shift;
        if (!shift) return;

        setSelectedShift(shift);
        setDrawerOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        form.resetFields();
    };

    return {
        selectedShift,
        setSelectedShift,
        drawerOpen,
        setDrawerOpen,
        modalOpen,
        modalMode,
        handleDateSelect,
        handleEventClick,
        openEditModal,
        closeModal,
    };
}