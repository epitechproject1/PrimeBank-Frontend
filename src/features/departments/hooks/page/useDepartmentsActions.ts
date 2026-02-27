import { useCallback } from "react";
import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "../../services/departments.service";
import type { DepartmentFilters } from "../../services/departments.service";
import { getErrorMessage } from "../../services/httpError";

export function useDepartmentsActions(params: {
    deptId?: number;
    search: string;
    page: number;
    pageSize: number;
    ordering?: DepartmentFilters["ordering"];
    detailsOpen: boolean;
}) {
    const { deptId, detailsOpen } = params;
    const qc = useQueryClient();

    const deleteMutation = useMutation<void, unknown, number>({
        mutationFn: (id: number) => departmentService.delete(id),

        onSuccess: async () => {
            message.success("Département supprimé");
            await Promise.all([
                qc.resetQueries({ queryKey: ["departments"], exact: false }),
                qc.resetQueries({ queryKey: ["departments-stats"], exact: true }),
            ]);
            if (typeof deptId === "number") {
                qc.removeQueries({ queryKey: ["department-teams", deptId] });
            }
        },

        onError: async (err) => {
            const msg = await getErrorMessage(err, "Erreur lors de la suppression du département");
            message.error(msg);
        },
    });

    const handleDelete = useCallback(async (id: number) => {
        try {
            await deleteMutation.mutateAsync(id);
        } catch {
        }
    }, [deleteMutation]);

    const onSaved = useCallback(async () => {
        await Promise.all([
            qc.resetQueries({ queryKey: ["departments"], exact: false }),
            qc.resetQueries({ queryKey: ["departments-stats"], exact: true }),
        ]);
    }, [qc]);

    const onRefresh = useCallback(async () => {
        await Promise.all([
            qc.resetQueries({ queryKey: ["departments"], exact: false }),
            qc.resetQueries({ queryKey: ["departments-stats"], exact: true }),
        ]);
        if (detailsOpen && typeof deptId === "number") {
            await qc.resetQueries({ queryKey: ["department-teams", deptId], exact: true });
        }
    }, [qc, detailsOpen, deptId]);

    const deletingId = deleteMutation.variables ?? null;

    return { handleDelete, onSaved, onRefresh, deletingId };
}