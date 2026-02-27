import { useState } from "react";
import dayjs from "dayjs";
import type { FormInstance } from "antd";

import type { Shift } from "../types/shift.types";
import type { ShiftOverrideFormValues } from "../../shiftOverride/components/ShiftOverrideModal";
import type {
    CreateShiftOverridePayload,
    ShiftOverride
} from "../../shiftOverride/types/shiftOverride.types";

type UpsertOverrideFn = (
    shiftId: number,
    payload: Omit<CreateShiftOverridePayload, "shift">
) => Promise<void>;


export function useOverrideModal(
    overrides: ShiftOverride[],
    upsertOverrideForShift: UpsertOverrideFn,
    overrideForm: FormInstance<ShiftOverrideFormValues>
) {
    const [overrideModalOpen, setOverrideModalOpen] = useState(false);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

    const getStartTime = (existing: ShiftOverride | undefined, shift: Shift) => {
        if (existing?.new_start_time) return dayjs(existing.new_start_time, "HH:mm:ss");
        if (shift.start_time) return dayjs(shift.start_time, "HH:mm:ss");
        return null;
    };

    const getEndTime = (existing: ShiftOverride | undefined, shift: Shift) => {
        if (existing?.new_end_time) return dayjs(existing.new_end_time, "HH:mm:ss");
        if (shift.end_time) return dayjs(shift.end_time, "HH:mm:ss");
        return null;
    };

    const openOverrideModal = (shift: Shift) => {
        const existing = overrides.find((o) => o.shift === shift.id);

        overrideForm.setFieldsValue({
            cancelled: existing?.cancelled ?? false,
            new_start_time: getStartTime(existing, shift),
            new_end_time: getEndTime(existing, shift),
            reason_code: existing?.reason_code ?? null,
            reason_note: existing?.reason_note ?? "",
        });

        setSelectedShift(shift);
        setOverrideModalOpen(true);
    };

    const submitOverride = async (values: ShiftOverrideFormValues) => {
        if (!selectedShift) return;

        await upsertOverrideForShift(selectedShift.id, {
            cancelled: values.cancelled,
            reason_code: values.reason_code,
            reason_note: values.reason_note,
            new_start_time: values.cancelled
                ? null
                : values.new_start_time?.format("HH:mm:ss"),
            new_end_time: values.cancelled
                ? null
                : values.new_end_time?.format("HH:mm:ss"),
        });

        setOverrideModalOpen(false);
    };

    return {
        overrideModalOpen,
        setOverrideModalOpen,
        openOverrideModal,
        submitOverride,
        selectedShift,
    };
}