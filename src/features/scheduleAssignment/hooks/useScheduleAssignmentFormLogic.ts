import { Form } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";
import type { Dayjs } from "dayjs";
import type { FormInstance } from "antd";
import {Option, ScheduleAssignmentFormValues} from "../components/ScheduleAssignmentForm.tsx";

type Params = {
    form: FormInstance<ScheduleAssignmentFormValues>;
    contracts: Option[];
    editing?: boolean;
};

export function useScheduleAssignmentFormLogic({
                                                   form,
                                                   contracts,
                                                   editing = false,
                                               }: Params) {
    const contractId = Form.useWatch("contract", form);

    const selectedContract = useMemo(
        () => contracts.find((c) => c.id === contractId),
        [contractId, contracts]
    );

    const handleContractChange = (value: number | string) => {
        const selected = contracts.find((c) => c.id === value);
        if (!selected) return;

        const today = dayjs();
        const start = selected.start_date ? dayjs(selected.start_date) : undefined;
        const end = selected.end_date ? dayjs(selected.end_date) : null;

        form.setFieldsValue({
            start_date: start && start.isBefore(today) ? today : start,
            end_date: end,
        });
    };

    const datesLocked = editing && form.getFieldValue("is_active");

    const disableDates = (current: Dayjs) => {
        if (!selectedContract?.start_date) return false;

        const start = dayjs(selectedContract.start_date);
        const end = selectedContract.end_date
            ? dayjs(selectedContract.end_date)
            : null;

        if (current.isBefore(start, "day")) return true;
        if (end && current.isAfter(end, "day")) return true;

        return false;
    };

    return {
        selectedContract,
        handleContractChange,
        disableDates,
        datesLocked,
    };
}