// ./features/planning/shift/hooks/useShiftsData.ts
import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import type { AxiosError } from "axios";

import type {
    Shift,
    CreateShiftPayload,
    UpdateShiftPayload,
} from "../types/shift.types";

import * as shiftsService from "../services/shifts.service";

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

export function useShiftsData() {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [total, setTotal] = useState(0);

    const fetchShifts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await shiftsService.getShifts({
                page: 1,
                page_size: 9999,
                search: "",
            });

            console.log("fetchShifts() → count:", res.count);

            // ✅ nouvelle référence
            setShifts([...res.results]);
            setTotal(res.count);
        } catch (err) {
            message.error(getErrorMessage(err, "Erreur chargement shifts"));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchShifts();
    }, [fetchShifts]);

    const createShift = useCallback(
        async (payload: CreateShiftPayload) => {
            try {
                console.log("createShift() payload:", payload);

                const res = await shiftsService.createShift(payload);

                console.log("createShift() SUCCESS:", res);

                message.success("Shift créé");

                await fetchShifts();
            } catch (err) {
                console.error("createShift() ERROR:", err);
                message.error(getErrorMessage(err, "Erreur création"));
            }
        },
        [fetchShifts]
    );

    const updateShift = useCallback(
        async (id: number, payload: UpdateShiftPayload) => {
            try {
                await shiftsService.updateShift(id, payload);
                message.success("Shift mis à jour");
                await fetchShifts();
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur mise à jour"));
            }
        },
        [fetchShifts]
    );

    const deleteShift = useCallback(
        async (id: number) => {
            try {
                await shiftsService.deleteShift(id);
                message.success("Shift supprimé");
                await fetchShifts();
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur suppression"));
            }
        },
        [fetchShifts]
    );

    return {
        shifts,
        loading,
        total,
        search,
        setSearch,
        fetchShifts,
        createShift,
        updateShift,
        deleteShift,
    };
}