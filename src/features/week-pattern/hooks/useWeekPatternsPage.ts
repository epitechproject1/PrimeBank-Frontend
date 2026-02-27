import { useEffect, useMemo, useState } from "react";
import { Form, message } from "antd";
import type { WeekPattern } from "../types/weekPattern.types";
import { useWeekPatternsData } from "./useWeekPatternsData";

export type WeekPatternFormValues = {
    name: string;
    description?: string;
};

export function useWeekPatternsPage() {
    const {
        weekPatterns,
        loading,
        fetchWeekPatterns,
        createWeekPattern,
        updateWeekPattern,
        deleteWeekPattern,
    } = useWeekPatternsData();

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<WeekPattern | null>(null);
    const [duplicating, setDuplicating] = useState(false);
    const [form] = Form.useForm<WeekPatternFormValues>();

    // ───────── FETCH ─────────
    useEffect(() => {
        fetchWeekPatterns();
    }, [fetchWeekPatterns]);

    // ───────── SELECTED DERIVED ─────────
    const selected = useMemo<WeekPattern | null>(() => {
        if (weekPatterns.length === 0) return null;
        if (!selectedId) return weekPatterns[0];
        return weekPatterns.find((p) => p.id === selectedId) ?? weekPatterns[0];
    }, [weekPatterns, selectedId]);

    // ───────── ACTIONS ─────────
    const setSelected = (pattern: WeekPattern | null) => {
        setSelectedId(pattern?.id ?? null);
    };

    const openCreate = () => {
        setEditing(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (pattern: WeekPattern) => {
        setEditing(pattern);
        form.setFieldsValue({
            name: pattern.name,
            description: pattern.description ?? "",
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
        form.resetFields();
    };

    const handleSubmit = async (values: WeekPatternFormValues) => {
        if (editing) {
            await updateWeekPattern(editing.id, values);
        } else {
            await createWeekPattern(values);
        }
        closeModal();
        await fetchWeekPatterns();
    };

    /**
     * Duplique uniquement le modèle (nom + description).
     * ⚠️ Ne copie PAS les créneaux horaires — c'est voulu :
     *    la duplication des créneaux doit se faire côté back
     *    ou via un endpoint dédié si besoin.
     * ➡️ N'ouvre PAS de modal.
     */
    const handleDuplicate = async (pattern: WeekPattern) => {
        if (duplicating) return;
        setDuplicating(true);
        try {
            await createWeekPattern({
                name: `${pattern.name} (copie)`,
                description: pattern.description ?? "",
            });
            await fetchWeekPatterns();
        } catch {
            message.error("Erreur lors de la duplication");
        } finally {
            setDuplicating(false);
        }
    };

    return {
        weekPatterns,
        loading,
        selected,
        modalOpen,
        editing,
        duplicating,
        form,
        setSelected,
        openCreate,
        openEdit,
        closeModal,
        handleSubmit,
        handleDuplicate,
        deleteWeekPattern,
        fetchWeekPatterns,
    };
}