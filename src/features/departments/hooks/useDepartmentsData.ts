import { useCallback, useState } from "react";
import { message } from "antd";
import type { AxiosError } from "axios";
import type { DepartmentType } from "../types/departments.type";
import { departmentService } from "../services/departments.service";

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


export function useDepartmentsData() {
    const [departments, setDepartments] = useState<DepartmentType[]>([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    const fetchDepartments = useCallback(async (q?: string) => {
        const query = (q ?? "").trim();
        const isSearch = query.length > 0;

        if (isSearch) setSearching(true);
        else setLoading(true);

        try {
            const res = await departmentService.getAll(isSearch ? { q: query } : undefined);
            setDepartments(res.items);
        } catch (err) {
            message.error(getErrorMessage(err, "Erreur chargement départements"));
        } finally {
            if (isSearch) setSearching(false);
            else setLoading(false);
        }
    }, []);

    const refreshDepartments = useCallback(
        async (currentSearch?: string) => {
            await fetchDepartments(currentSearch);
        },
        [fetchDepartments]
    );

    const handleDelete = useCallback(
        async (id: number, currentSearch?: string) => {
            try {
                await departmentService.delete(id);
                message.success("Département supprimé");
                await fetchDepartments(currentSearch);
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur suppression"));
            }
        },
        [fetchDepartments]
    );

    return { departments, loading, searching, fetchDepartments, refreshDepartments, handleDelete };
}
