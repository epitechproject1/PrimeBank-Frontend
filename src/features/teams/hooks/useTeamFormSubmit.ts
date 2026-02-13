import { useCallback, useState } from "react";
import { message } from "antd";
import type { FormInstance } from "antd/es/form";
import type { TeamType, CreateTeamPayload, UpdateTeamPayload } from "../types/teams.type";
import { teamService } from "../services/teams.service";

type TeamFormValues = {
    name: string;
    description?: string;
    owner_id: number;
    department_id: number;
    members_ids?: number[];
};

type UseTeamFormSubmitArgs = {
    form: FormInstance<TeamFormValues>;
    editTeam: TeamType | null;
    onSaved: (team: TeamType) => void;
    onClose: () => void;
};

export function useTeamFormSubmit({ form, editTeam, onSaved, onClose }: UseTeamFormSubmitArgs) {
    const [messageApi, contextHolder] = message.useMessage();
    const [saving, setSaving] = useState(false);

    const handleSubmit = useCallback(async () => {
        setSaving(true);
        try {
            const values = await form.validateFields();

            // ✅ ensure owner is always included in members_ids
            const membersSet = new Set<number>(values.members_ids ?? []);
            if (values.owner_id) membersSet.add(values.owner_id);

            const payloadBase = {
                name: values.name,
                description: values.description ?? null,
                owner_id: values.owner_id,
                department_id: values.department_id,
                members_ids: Array.from(membersSet),
            };

            let saved: TeamType;

            if (editTeam) {
                const payload: UpdateTeamPayload = payloadBase;
                saved = await teamService.update(editTeam.id, payload);
            } else {
                const payload: CreateTeamPayload = payloadBase;
                saved = await teamService.create(payload);
            }

            messageApi.success(editTeam ? "Équipe modifiée" : "Équipe créée");
            onSaved(saved);
            onClose();
            form.resetFields();
        } catch (e) {
            const err = e as Error;
            messageApi.error(err?.message ?? "Erreur lors de l'enregistrement");
        } finally {
            setSaving(false);
        }
    }, [editTeam, form, messageApi, onClose, onSaved]);

    return { handleSubmit, saving, contextHolder };
}
