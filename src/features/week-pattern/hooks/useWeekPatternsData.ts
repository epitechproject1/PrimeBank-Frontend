// ./features/planning/hooks/useWeekPatternsData.ts

import { useCallback, useState } from "react";
import { message } from "antd";
import type { AxiosError } from "axios";
import * as weekPatternService from "../services/weekPatterns.service.ts";
import {CreateWeekPatternPayload, UpdateWeekPatternPayload, WeekPattern} from "../types/weekPattern.types.ts";

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

export function useWeekPatternsData() {
    const [weekPatterns, setWeekPatterns] = useState<WeekPattern[]>([]);
    const [loading, setLoading] = useState(false);

    // ==============================
    // FETCH
    // ==============================
    const fetchWeekPatterns = useCallback(async () => {
        setLoading(true);
        try {
            const res = await weekPatternService.getWeekPatterns();

            // compatible pagination DRF ou liste brute
            const items = Array.isArray(res) ? res : res.results ?? [];
            setWeekPatterns(items);
        } catch (err) {
            message.error(getErrorMessage(err, "Erreur chargement semaines types"));
        } finally {
            setLoading(false);
        }
    }, []);

    // ==============================
    // CREATE
    // ==============================
    const createWeekPattern = useCallback(
        async (payload: CreateWeekPatternPayload) => {
            try {
                await weekPatternService.createWeekPattern(payload);
                message.success("Semaine type créée");
                await fetchWeekPatterns();
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur création"));
            }
        },
        [fetchWeekPatterns]
    );

    // ==============================
    // UPDATE
    // ==============================
    const updateWeekPattern = useCallback(
        async (id: number, payload: UpdateWeekPatternPayload) => {
            try {
                await weekPatternService.updateWeekPattern(id, payload);
                message.success("Semaine mise à jour");
                await fetchWeekPatterns();
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur mise à jour"));
            }
        },
        [fetchWeekPatterns]
    );

    // ==============================
    // DELETE
    // ==============================
    const deleteWeekPattern = useCallback(
        async (id: number) => {
            try {
                await weekPatternService.deleteWeekPattern(id);
                message.success("Semaine supprimée");
                await fetchWeekPatterns();
            } catch {
                message.error("Impossible de supprimer cette semaine type déja associer");
            }
        },
        [fetchWeekPatterns]
    );
    return {
        weekPatterns,
        loading,
        fetchWeekPatterns,
        createWeekPattern,
        updateWeekPattern,
        deleteWeekPattern,
    };
}