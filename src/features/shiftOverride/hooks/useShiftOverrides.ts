// ./features/planning/shift-override/hooks/useShiftOverridesData.ts

import { useCallback, useState } from "react";
import { message } from "antd";
import type { AxiosError } from "axios";

import type {
    ShiftOverride,
    CreateShiftOverridePayload,
    UpdateShiftOverridePayload,
    ShiftOverrideFilters,
} from "../types/shiftOverride.types";

import * as shiftOverrideService from "../services/shiftOverrides.service";

type ApiErrorShape = {
    detail?: string;
    message?: string;
};

// ─────────────────────────────────────────────
// Error helper (complexity réduite)
// ─────────────────────────────────────────────
function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error) return error.message;

    const axiosError = error as AxiosError<ApiErrorShape> | undefined;
    const data = axiosError?.response?.data;

    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    if (data.message) return data.message;

    return fallback;
}

export function useShiftOverridesData() {
    const [overrides, setOverrides] = useState<ShiftOverride[]>([]);
    const [loading, setLoading] = useState(false);

    // ─────────────────────────────────────────────
    // FETCH
    // ─────────────────────────────────────────────
    const fetchOverrides = useCallback(async (filters?: ShiftOverrideFilters) => {
        setLoading(true);
        try {
            const res = await shiftOverrideService.getShiftOverrides(filters);
            setOverrides(res);
        } catch (err) {
            message.error(getErrorMessage(err, "Erreur chargement exceptions"));
        } finally {
            setLoading(false);
        }
    }, []);

    // ─────────────────────────────────────────────
    // CREATE
    // ─────────────────────────────────────────────
    const createOverride = useCallback(
        async (payload: CreateShiftOverridePayload, filters?: ShiftOverrideFilters) => {
            try {
                await shiftOverrideService.createShiftOverride(payload);
                message.success("Exception créée");
                await fetchOverrides(filters);
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur création exception"));
                throw err;
            }
        },
        [fetchOverrides]
    );

    // ─────────────────────────────────────────────
    // UPDATE
    // ─────────────────────────────────────────────
    const updateOverride = useCallback(
        async (id: number, payload: UpdateShiftOverridePayload, filters?: ShiftOverrideFilters) => {
            try {
                await shiftOverrideService.updateShiftOverride(id, payload);
                message.success("Exception mise à jour");
                await fetchOverrides(filters);
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur mise à jour exception"));
                throw err;
            }
        },
        [fetchOverrides]
    );

    // ─────────────────────────────────────────────
    // UPSERT
    // ─────────────────────────────────────────────
    const upsertOverrideForShift = useCallback(
        async (
            shiftId: number,
            payload: Omit<CreateShiftOverridePayload, "shift">,
            filters?: ShiftOverrideFilters
        ) => {
            try {
                const res = await shiftOverrideService.getShiftOverrides({ shift: shiftId });

                const existing = res.length > 0 ? res[0] : null;

                if (existing) {
                    await shiftOverrideService.updateShiftOverride(existing.id, {
                        shift: shiftId,
                        ...payload,
                    });
                    message.success("Override mis à jour");
                } else {
                    await shiftOverrideService.createShiftOverride({
                        shift: shiftId,
                        ...payload,
                    });
                    message.success("Override créé");
                }

                await fetchOverrides(filters ?? { shift: shiftId });
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur override shift"));
                throw err;
            }
        },
        [fetchOverrides]
    );

    // ─────────────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────────────
    const deleteOverride = useCallback(
        async (id: number, filters?: ShiftOverrideFilters) => {
            try {
                await shiftOverrideService.deleteShiftOverride(id);
                message.success("Exception supprimée");
                await fetchOverrides(filters);
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur suppression exception"));
                throw err;
            }
        },
        [fetchOverrides]
    );

    return {
        overrides,
        loading,
        fetchOverrides,
        createOverride,
        updateOverride,
        upsertOverrideForShift,
        deleteOverride,
    };
}