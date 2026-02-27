import { useCallback, useState } from "react";
import { message } from "antd";
import type { FormInstance } from "antd/es/form";
import type { TeamType, CreateTeamPayload, UpdateTeamPayload } from "../../types/teams.type";
import { teamService } from "../../services/teams.service";
import axios from "axios";
import {getErrorMessage} from "../../../departments/services/httpError.ts";

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

            const membersSet = new Set<number>(values.members_ids ?? []);
            if (values.owner_id) membersSet.add(values.owner_id);

            const payloadBase = {
                name: (values.name ?? "").trim(),
                description: (values.description ?? "").trim() || null,
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
        } catch (err: unknown) {
            if ((err as any)?.errorFields) return;

            if (axios.isAxiosError(err)) {
                const data: any = err.response?.data;

                if (data?.name) {
                    const msg = Array.isArray(data.name) ? String(data.name[0]) : String(data.name);
                    form.setFields([{ name: "name", errors: [msg] }]);
                    messageApi.error(msg);
                    return;
                }

                if (data?.description) {
                    const msg = Array.isArray(data.description)
                        ? String(data.description[0])
                        : String(data.description);
                    form.setFields([{ name: "description", errors: [msg] }]);
                    messageApi.error(msg);
                    return;
                }

                if (data?.department_id) {
                    const msg = Array.isArray(data.department_id)
                        ? String(data.department_id[0])
                        : String(data.department_id);
                    form.setFields([{ name: "department_id", errors: [msg] }]);
                    messageApi.error(msg);
                    return;
                }

                if (data?.owner_id) {
                    const msg = Array.isArray(data.owner_id) ? String(data.owner_id[0]) : String(data.owner_id);
                    form.setFields([{ name: "owner_id", errors: [msg] }]);
                    messageApi.error(msg);
                    return;
                }

                if (data?.members_ids) {
                    const msg = Array.isArray(data.members_ids)
                        ? String(data.members_ids[0])
                        : String(data.members_ids);
                    form.setFields([{ name: "members_ids", errors: [msg] }]);
                    messageApi.error(msg);
                    return;
                }
            }

            const msg = await getErrorMessage(err, "Erreur lors de l'enregistrement");
            if ((msg || "").toLowerCase().includes("existe déjà")) {
                form.setFields([{ name: "name", errors: [msg] }]);
            }
            messageApi.error(msg);
        } finally {
            setSaving(false);
        }
    }, [editTeam, form, messageApi, onClose, onSaved]);

    return { handleSubmit, saving, contextHolder };
}