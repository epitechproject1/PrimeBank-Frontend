import { useCallback, useState } from "react";
import { message } from "antd";
import type { FormInstance } from "antd/es/form";
import axios, { type AxiosError } from "axios";

import { teamService } from "../../services/teams.service";
import type { TeamType, CreateTeamPayload, UpdateTeamPayload } from "../../types/teams.type";
import { getErrorMessage } from "../../../departments/services/httpError";

type TeamFormValues = {
    name: string;
    description?: string;
    owner_id: number;
    department_id: number;
    members_ids?: number[];
};

type FieldName = keyof Pick<
    TeamFormValues,
    "name" | "description" | "owner_id" | "department_id" | "members_ids"
>;

type ApiFieldErrors = Partial<Record<FieldName, string[] | string>> & {
    detail?: string;
    message?: string;
    error?: string;
    non_field_errors?: string[] | string;
};

type OnSaved = (() => void) | ((team: TeamType) => void | Promise<void>);

function normalizeString(v: unknown): string | null {
    if (typeof v === "string" && v.trim()) return v;
    if (Array.isArray(v) && v.length > 0) return v[0] != null ? String(v[0]) : null;
    if (v != null) return String(v);
    return null;
}

function buildPayload(values: TeamFormValues): CreateTeamPayload {
    return {
        name: (values.name ?? "").trim(),
        description: (values.description ?? "").trim() || null,
        owner_id: values.owner_id,
        department_id: values.department_id,
        members_ids: Array.isArray(values.members_ids) ? values.members_ids : [],
    };
}

async function saveTeam(editTeam: TeamType | null | undefined, values: TeamFormValues): Promise<TeamType> {
    const payload = buildPayload(values);

    if (editTeam) {
        const updatePayload: UpdateTeamPayload = payload;
        return teamService.update(editTeam.id, updatePayload);
    }

    return teamService.create(payload);
}

function isAntdValidationError(err: unknown): boolean {
    return typeof err === "object" && err !== null && "errorFields" in err;
}

function extractAxiosData(err: unknown): unknown {
    if (!axios.isAxiosError(err)) return null;
    return (err as AxiosError).response?.data ?? null;
}

function applyArrayOrStringError(data: unknown): boolean {
    if (Array.isArray(data)) {
        const msg = normalizeString(data);
        if (msg) message.error(msg);
        return true;
    }
    if (typeof data === "string") {
        message.error(data);
        return true;
    }
    return false;
}

function applyObjectFieldErrors(form: FormInstance, data: unknown): boolean {
    if (typeof data !== "object" || data === null) return false;

    const obj = data as ApiFieldErrors;
    const fields: FieldName[] = ["name", "description", "owner_id", "department_id", "members_ids"];

    for (const f of fields) {
        const msg = normalizeString(obj[f]);
        if (msg) {
            form.setFields([{ name: f, errors: [msg] }]);
            message.error(msg);
            return true;
        }
    }

    const generic =
        normalizeString(obj.error) ||
        normalizeString(obj.message) ||
        normalizeString(obj.detail) ||
        normalizeString(obj.non_field_errors);

    if (generic) {
        message.error(generic);
        return true;
    }

    return false;
}

function applyBackendFieldErrors(form: FormInstance, err: unknown): boolean {
    const data = extractAxiosData(err);
    if (!data) return false;
    if (applyArrayOrStringError(data)) return true;
    return applyObjectFieldErrors(form, data);
}

async function callOnSaved(onSaved: OnSaved, team: TeamType): Promise<void> {
    if (onSaved.length === 0) {
        await Promise.resolve((onSaved as () => void)());
        return;
    }
    await Promise.resolve((onSaved as (t: TeamType) => void | Promise<void>)(team));
}

export function useTeamFormSubmit(args: {
    form: FormInstance<TeamFormValues>;
    editTeam?: TeamType | null;
    onSaved: OnSaved;
    onClose: () => void;
}) {
    const { form, editTeam, onSaved, onClose } = args;
    const [saving, setSaving] = useState(false);

    const submit = useCallback(async () => {
        setSaving(true);
        try {
            const values = await form.validateFields();
            const team = await saveTeam(editTeam, values);

            message.success(editTeam ? "Équipe modifiée" : "Équipe créée");
            await callOnSaved(onSaved, team);

            onClose();
            form.resetFields();
        } catch (err: unknown) {
            if (isAntdValidationError(err)) return;
            if (applyBackendFieldErrors(form, err)) return;

            const msg = await getErrorMessage(err, "Erreur lors de l'enregistrement");
            message.error(msg);
        } finally {
            setSaving(false);
        }
    }, [editTeam, form, onClose, onSaved]);

    return { submit, saving };
}