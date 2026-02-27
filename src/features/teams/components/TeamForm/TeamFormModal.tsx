import { useEffect, useMemo } from "react";
import { Modal, Form, Space, Spin } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

import type { TeamType } from "../../types/teams.type";
import { useTeamFormOptions } from "../../hooks/form/useTeamFormOptions";
import { useTeamFormSubmit } from "../../hooks/form/useTeamFormSubmit";

import { TeamFormFields } from "./TeamFormFields";
import { mapUsersToOptions } from "../../utils/team-form-utils";
import { formatUserOptions, type SelectOption } from "../form/team-select-options";

interface TeamFormModalProps {
    open: boolean;
    editTeam: TeamType | null;
    onClose: () => void;
    onSaved: (() => void) | ((team: TeamType) => void | Promise<void>);
}

interface TeamFormValues {
    name: string;
    description?: string;
    owner_id: number;
    department_id: number;
    members_ids?: number[];
}

type DepartmentLite = {
    id: number;
    name?: string | null;
    title?: string | null;
    label?: string | null;
    code?: string | null;
};

export function TeamFormModal({ open, editTeam, onClose, onSaved }: TeamFormModalProps) {
    const [form] = Form.useForm<TeamFormValues>();

    const { users, departments, loadingOptions } = useTeamFormOptions(open);

    const { submit, saving } = useTeamFormSubmit({
        form,
        editTeam,
        onSaved,
        onClose,
    });

    const userOptions = useMemo(
        () => formatUserOptions(mapUsersToOptions(users), users),
        [users]
    );

    const deptOptions = useMemo<SelectOption[]>(() => {
        const list: DepartmentLite[] = Array.isArray(departments)
            ? (departments as DepartmentLite[])
            : [];

        return list.map((d) => {
            const labelText = d.name ?? d.title ?? d.label ?? d.code ?? `Département #${d.id}`;

            return {
                value: d.id,
                label: <span>{String(labelText)}</span>,
                searchLabel: String(labelText).toLowerCase(),
            };
        });
    }, [departments]);

    useEffect(() => {
        if (!open) return;

        if (editTeam) {
            form.setFieldsValue({
                name: editTeam.name,
                description: editTeam.description ?? undefined,
                owner_id: editTeam.owner?.id as number,
                department_id: editTeam.department?.id as number,
                members_ids: editTeam.members?.map((m) => m.id) ?? [],
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ members_ids: [] });
        }
    }, [open, editTeam, form]);

    return (
        <Modal
            title={
                <Space>
                    {editTeam ? <EditOutlined /> : <PlusOutlined />}
                    {editTeam ? "Modifier l'équipe" : "Nouvelle équipe"}
                </Space>
            }
            open={open}
            onCancel={onClose}
            onOk={submit}
            okText={editTeam ? "Enregistrer" : "Créer"}
            cancelText="Annuler"
            confirmLoading={saving}
            destroyOnClose
            width={520}
        >
            <Spin spinning={loadingOptions}>
                <TeamFormFields
                    form={form}
                    loadingOptions={loadingOptions}
                    userOptions={userOptions}
                    deptOptions={deptOptions}
                />
            </Spin>
        </Modal>
    );
}

export default TeamFormModal;