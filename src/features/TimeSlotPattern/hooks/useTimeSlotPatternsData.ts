// ./features/planning/hooks/useTimeSlotPatternsData.ts

import { useCallback, useState } from "react";
import { message } from "antd";
import type { AxiosError } from "axios";
import * as timeSlotService from "../services/timeSlotPatterns.service";
import {
    CreateTimeSlotPatternPayload,
    TimeSlotPattern,
    UpdateTimeSlotPatternPayload
} from "../types/timeSlotPattern.types.ts";

type ApiErrorShape = { detail?: string; message?: string };

function getErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof Error) return err.message;

    const axiosErr = err as AxiosError<ApiErrorShape>;
    const data = axiosErr?.response?.data;

    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (typeof data.detail === "string") return data.detail;
    if (typeof data.message === "string") return data.message;

    return fallback;
}

export function useTimeSlotPatternsData() {
    const [timeSlots, setTimeSlots] = useState<TimeSlotPattern[]>([]);
    const [loading, setLoading] = useState(false);

    // =====================================================
    // FETCH
    // =====================================================
    const fetchTimeSlots = useCallback(async (weekPatternId?: number) => {
        setLoading(true);
        try {
            const res = await timeSlotService.getTimeSlots(
                weekPatternId ? { week_pattern: weekPatternId } : undefined
            );
            setTimeSlots(res);
        } catch (err) {
            message.error(getErrorMessage(err, "Erreur chargement créneaux"));
        } finally {
            setLoading(false);
        }
    }, []);

    // =====================================================
    // CREATE
    // =====================================================
    const createTimeSlot = useCallback(
        async (payload: CreateTimeSlotPatternPayload) => {
            try {
                await timeSlotService.createTimeSlot(payload);
                message.success("Créneau créé");

                // refresh si weekPattern connu
                if (payload.week_pattern) {
                    await fetchTimeSlots(payload.week_pattern);
                }
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur création créneau"));
            }
        },
        [fetchTimeSlots]
    );

    // =====================================================
    // UPDATE
    // =====================================================
    const updateTimeSlot = useCallback(
        async (
            id: number,
            payload: UpdateTimeSlotPatternPayload,
            weekPatternId?: number // on le passe explicitement
        ) => {
            try {
                await timeSlotService.updateTimeSlot(id, payload);
                message.success("Créneau mis à jour");

                await fetchTimeSlots(weekPatternId);
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur mise à jour"));
            }
        },
        [fetchTimeSlots]
    );

    // =====================================================
    // DELETE
    // =====================================================
    const deleteTimeSlot = useCallback(
        async (id: number, weekPatternId?: number) => {
            try {
                await timeSlotService.deleteTimeSlot(id);
                message.success("Créneau supprimé");
                await fetchTimeSlots(weekPatternId);
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur suppression"));
            }
        },
        [fetchTimeSlots]
    );

    return {
        timeSlots,
        loading,
        fetchTimeSlots,
        createTimeSlot,
        updateTimeSlot,
        deleteTimeSlot,
    };
}