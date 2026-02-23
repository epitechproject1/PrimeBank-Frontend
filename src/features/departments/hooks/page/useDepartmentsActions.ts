import { useCallback } from "react";
import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "../../services/departments.service";
import type { DepartmentFilters } from "../../services/departments.service";

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

    const deleteMutation = useMutation<void, Error, number>({
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
        onError: () => message.error("Erreur suppression"),
    });

    const handleDelete = useCallback(async (id: number) => {
        await deleteMutation.mutateAsync(id);
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