import { useCallback } from "react";
import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "../../services/departments.service";

export function useDepartmentsActions(params: {
    deptId?: number;
    search: string;
    page: number;
    pageSize: number;
    detailsOpen: boolean;
}) {
    const { deptId, search, page, pageSize, detailsOpen } = params;
    const qc = useQueryClient();

    const deleteMutation = useMutation<void, Error, number>({
        mutationFn: (id: number) => departmentService.delete(id),
        onSuccess: async () => {
            message.success("Département supprimé");

            await Promise.all([
                qc.invalidateQueries({ queryKey: ["departments"], exact: false }),
                qc.invalidateQueries({ queryKey: ["departments-stats"], exact: true }),
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
            qc.invalidateQueries({ queryKey: ["departments"], exact: false }),
            qc.invalidateQueries({ queryKey: ["departments-stats"], exact: true }),
        ]);
    }, [qc]);

    const onRefresh = useCallback(async () => {
        await Promise.all([
            qc.refetchQueries({ queryKey: ["departments", search, page, pageSize], exact: true, type: "active" }),
            qc.refetchQueries({ queryKey: ["departments-stats"], exact: true, type: "active" }),
        ]);

        if (detailsOpen && typeof deptId === "number") {
            await qc.refetchQueries({ queryKey: ["department-teams", deptId], exact: true, type: "active" });
        }
    }, [qc, search, page, pageSize, detailsOpen, deptId]);

    const deletingId = deleteMutation.variables ?? null;

    return { handleDelete, onSaved, onRefresh, deletingId };
}
