import { useState } from "react";
import type { ScheduleAssignment } from "../types/scheduleAssignment.types";

export function useScheduleAssignmentsUIState(assignments: ScheduleAssignment[]) {
    const [selected, setSelected] = useState<ScheduleAssignment | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] =
        useState<ScheduleAssignment | null>(null);
    const [viewMode, setViewMode] = useState<"list" | "timeline">("list");
    const [filterActive, setFilterActive] = useState<boolean | null>(null);

    const openDetail = (a: ScheduleAssignment | null) => {
        setSelected(a);
        setDetailOpen(!!a);
    };

    const closeDetail = () => {
        setDetailOpen(false);
        setSelected(null);
    };

    const openEdit = (a: ScheduleAssignment) => {
        setEditingAssignment(a);
        setDetailOpen(false);
        setFormModalOpen(true);
    };

    const openCreate = () => {
        setEditingAssignment(null);
        setFormModalOpen(true);
    };

    const closeForm = () => {
        setFormModalOpen(false);

        if (editingAssignment) {
            const updated = assignments.find((a) => a.id === editingAssignment.id);
            if (updated) setSelected(updated);
        }

        setEditingAssignment(null);
    };

    return {
        selected,
        setSelected,
        detailOpen,
        formModalOpen,
        editingAssignment,
        viewMode,
        filterActive,

        setViewMode,
        setFilterActive,

        openDetail,
        closeDetail,
        openEdit,
        openCreate,
        closeForm,
    };
}