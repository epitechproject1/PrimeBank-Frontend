import { useState } from "react";
import { FormInstance, message } from "antd";
import { TeamType, CreateTeamPayload } from "../types/teams.type";
import { teamService } from "../services/teams.service";

interface TeamFormValues {
    name: string;
    description?: string;
    owner_id: number;
    department_id: number;
}

interface UseTeamFormSubmitParams {
    form: FormInstance<TeamFormValues>;
    editTeam: TeamType | null;
    onSaved: (team: TeamType) => void;
    onClose: () => void;
}

export function useTeamFormSubmit({
                                      form,
                                      editTeam,
                                      onSaved,
                                      onClose,
                                  }: UseTeamFormSubmitParams) {
    const [messageApi, contextHolder] = message.useMessage();
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        try {
            setSaving(true);
            const values = await form.validateFields();

            const payload: CreateTeamPayload = {
                name: values.name,
                description: values.description || null,
                owner_id: values.owner_id,
                department_id: values.department_id,
            };

            const result = editTeam?.id
                ? await teamService.partialUpdate(editTeam.id, payload)
                : await teamService.create(payload);

            messageApi.success(
                editTeam ? "Équipe modifiée !" : "Équipe créée !"
            );

            onSaved(result);
            onClose();
        } catch (error) {
            handleError(error);
        } finally {
            setSaving(false);
        }
    };

    const handleError = (error: unknown) => {
        const err = error as {
            errorFields?: unknown;
            response?: { data?: { detail?: string } };
            message?: string;
        };

        if (err?.errorFields) return;

        const errorMessage =
            err?.response?.data?.detail ||
            err?.message ||
            "Erreur lors de la sauvegarde";

        messageApi.error(errorMessage);
    };

    return { handleSubmit, saving, contextHolder };
}