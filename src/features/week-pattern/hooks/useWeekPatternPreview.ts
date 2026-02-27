import { useEffect, useMemo, useState } from "react";
import { Form, message } from "antd";
import dayjs from "dayjs";

import { useTimeSlotPatternsData } from "../../TimeSlotPattern/hooks/useTimeSlotPatternsData";
import {
    CreateTimeSlotPatternPayload,
    SlotType,
    TimeSlotPattern,
    WeekDay,
} from "../../TimeSlotPattern/types/timeSlotPattern.types";
import { TimeSlotFormValues } from "../types/weekPattern.types.ts";

export type FormValues = {
    week_pattern: number;
    weekday: WeekDay;
    start_time: dayjs.Dayjs;
    end_time: dayjs.Dayjs;
    slot_type: SlotType;
};

function normalizeWeekPattern(slot: TimeSlotPattern): number {
    return typeof slot.week_pattern === "number"
        ? slot.week_pattern
        : slot.week_pattern.id;
}

export function useWeekPatternPreview(
    weekPatternId: number | null,
    onSlotsLoaded?: (slots: TimeSlotPattern[]) => void
) {
    const {
        timeSlots,
        loading,
        fetchTimeSlots,
        createTimeSlot,
        updateTimeSlot,
        deleteTimeSlot,
    } = useTimeSlotPatternsData();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editing, setEditing] = useState<TimeSlotPattern | null>(null);
    const [prefillWeekday, setPrefillWeekday] = useState<number | null>(null);
    const [form] = Form.useForm<FormValues>();

    useEffect(() => {
        if (weekPatternId) fetchTimeSlots(weekPatternId);
    }, [weekPatternId, fetchTimeSlots]);

    // Remonte les slots au parent dès qu'ils changent
    useEffect(() => {
        onSlotsLoaded?.(timeSlots);
    }, [timeSlots, onSlotsLoaded]);

    const groupedSlots = useMemo(() => {
        const map: Record<number, TimeSlotPattern[]> = {
            0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
        };
        timeSlots.forEach((slot) => map[slot.weekday].push(slot));
        return map;
    }, [timeSlots]);

    const openCreate = (weekday: WeekDay) => {
        setEditing(null);
        setPrefillWeekday(weekday);
        form.setFieldsValue({
            week_pattern: weekPatternId ?? 0,
            weekday,
            slot_type: SlotType.WORK,
        });
        setDrawerOpen(true);
    };

    const openEdit = (slot: TimeSlotPattern) => {
        setEditing(slot);
        setPrefillWeekday(null);
        form.setFieldsValue({
            week_pattern: normalizeWeekPattern(slot),
            weekday: slot.weekday,
            start_time: dayjs(slot.start_time, "HH:mm:ss"),
            end_time: dayjs(slot.end_time, "HH:mm:ss"),
            slot_type: slot.slot_type,
        });
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditing(null);
        setPrefillWeekday(null);
        form.resetFields();
    };

    const handleSubmit = async (values: TimeSlotFormValues) => {
        if (!weekPatternId) return;

        const payload: CreateTimeSlotPatternPayload = {
            week_pattern: weekPatternId,
            weekday: values.weekday,
            slot_type: values.slot_type,
            start_time: values.start_time.format("HH:mm:ss"),
            end_time: values.end_time.format("HH:mm:ss"),
        };

        if (editing) {
            await updateTimeSlot(editing.id, payload, weekPatternId);
        } else {
            await createTimeSlot(payload);
        }

        closeDrawer();
    };

    /**
     * Duplique un créneau vers un jour cible.
     * ✅ Le jour source est déjà exclu du dropdown dans TimeSlotCard.
     * ✅ Vérifie qu'aucun créneau identique (start_time + end_time + slot_type)
     *    n'existe déjà sur le jour cible avant de créer.
     */
    const handleDuplicateSlot = async (
        slot: TimeSlotPattern,
        targetWeekday: WeekDay
    ) => {
        if (!weekPatternId) return;

        const existingOnTarget = groupedSlots[targetWeekday] ?? [];

        const alreadyExists = existingOnTarget.some(
            (s) =>
                s.start_time === slot.start_time &&
                s.end_time === slot.end_time &&
                s.slot_type === slot.slot_type
        );

        if (alreadyExists) {
            message.warning("Un créneau identique existe déjà sur ce jour.");
            return;
        }

        await createTimeSlot({
            week_pattern: weekPatternId,
            weekday: targetWeekday,
            slot_type: slot.slot_type,
            start_time: slot.start_time,
            end_time: slot.end_time,
        });
    };

    return {
        groupedSlots,
        loading,
        drawerOpen,
        editing,
        prefillWeekday,
        form,
        openCreate,
        openEdit,
        closeDrawer,
        handleSubmit,
        deleteTimeSlot,
        createTimeSlot,
        handleDuplicateSlot,
    };
}