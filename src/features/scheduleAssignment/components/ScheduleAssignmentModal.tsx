import { useEffect, useMemo, useState } from "react";
import { Form, Modal } from "antd";
import dayjs from "dayjs";

import { useWeekPatternsData } from "../../week-pattern/hooks/useWeekPatternsData";
import { useContractsData } from "../../contract/hooks/useContractsData";

import {
    ScheduleAssignmentForm,
    type ScheduleAssignmentFormValues,
    type Option,
} from "./ScheduleAssignmentForm";

import type {
    ScheduleAssignment,
    CreateScheduleAssignmentPayload,
    UpdateScheduleAssignmentPayload,
} from "../types/scheduleAssignment.types";

import type { WeekPattern } from "../../week-pattern/types/weekPattern.types";
import type { Contract } from "../../contract/types/contract.types";

type Props = {
    open: boolean;
    editing?: ScheduleAssignment | null;
    onClose: () => void;
    onSubmit: (
        payload: CreateScheduleAssignmentPayload | UpdateScheduleAssignmentPayload,
        id?: number
    ) => Promise<void>;
};

function contractToOption(c: Contract): Option {
    const name = `${c.user_detail?.first_name ?? ""} ${c.user_detail?.last_name ?? ""}`.trim();

    return {
        id: c.id,
        label: name || `Contrat #${c.id}`,
        start_date: c.start_date,
        end_date: c.end_date,
        weekly_hours_target: c.weekly_hours_target!,
        contract_type: c.contract_type_detail?.name,
        requires_end_date: c.contract_type_detail?.requires_end_date,
    };
}

function weekPatternToOption(w: WeekPattern): Option {
    return {
        id: w.id,
        label: w.name ?? `Semaine #${w.id}`,
    };
}

export function ScheduleAssignmentModal({
                                            open,
                                            editing = null,
                                            onClose,
                                            onSubmit,
                                        }: Props) {
    const { weekPatterns, fetchWeekPatterns } = useWeekPatternsData();
    const { contracts, fetchContracts } = useContractsData();

    const [form] = Form.useForm<ScheduleAssignmentFormValues>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;
        fetchWeekPatterns();
        fetchContracts();
    }, [open, fetchWeekPatterns, fetchContracts]);

    useEffect(() => {
        if (!open) return;

        form.resetFields();

        if (!editing) {
            form.setFieldsValue({ is_active: true });
            return;
        }

        form.setFieldsValue({
            contract: editing.contract,
            week_pattern: editing.week_pattern,
            start_date: dayjs(editing.start_date),
            end_date: editing.end_date ? dayjs(editing.end_date) : null,
            is_active: editing.is_active ?? true,
        });
    }, [open, editing, form]);

    const contractOptions = useMemo(
        () => (contracts ?? []).map(contractToOption),
        [contracts]
    );

    const weekPatternOptions = useMemo(
        () => (weekPatterns ?? []).map(weekPatternToOption),
        [weekPatterns]
    );

    const handleSubmit = async (values: ScheduleAssignmentFormValues) => {
        const payload = {
            contract: Number(values.contract),
            week_pattern: Number(values.week_pattern),
            start_date: values.start_date.format("YYYY-MM-DD"),
            end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
            is_active: values.is_active ?? true,
        };

        setIsSubmitting(true);
        try {
            await onSubmit(payload, editing?.id);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={editing ? "Modifier l'assignation" : "Créer une assignation"}
            footer={null}
            destroyOnHidden
            width={520}
        >
            <div style={{ paddingTop: 8 }}>
                <ScheduleAssignmentForm
                    form={form}
                    contracts={contractOptions}
                    weekPatterns={weekPatternOptions}
                    loading={isSubmitting}
                    editing={!!editing}
                    onSubmit={handleSubmit}
                />
            </div>
        </Modal>
    );
}