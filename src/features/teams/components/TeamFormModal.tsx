import { useEffect, useMemo } from "react";
import { Modal, Form, Space, Spin } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { TeamType } from "../types/teams.type";
import { useTeamFormOptions } from "../hooks/useTeamFormOptions";
import { useTeamFormSubmit } from "../hooks/useTeamFormSubmit";
import { TeamFormFields } from "./TeamFormFields";
import { mapDepartmentsToOptions, mapUsersToOptions } from "../utils/team-form-utils";
import { formatDepartmentOptions, formatUserOptions } from "../utils/team-select-options";

interface TeamFormModalProps {
    open: boolean;
    editTeam: TeamType | null;
    onClose: () => void;
    onSaved: (team: TeamType) => void;
}

interface TeamFormValues {
    name: string;
    description?: string;
    owner_id: number;
    department_id: number;
    members_ids?: number[];
}

export function TeamFormModal({ open, editTeam, onClose, onSaved }: TeamFormModalProps) {
    const [form] = Form.useForm<TeamFormValues>();

    const { users, departments, loadingOptions } = useTeamFormOptions(open);

    const { handleSubmit, saving, contextHolder } = useTeamFormSubmit({
        form,
        editTeam,
        onSaved,
        onClose,
    });

    const userOptions = useMemo(
        () => formatUserOptions(mapUsersToOptions(users), users),
        [users]
    );

    const deptOptions = useMemo(
        () => formatDepartmentOptions(mapDepartmentsToOptions(departments)),
        [departments]
    );

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
        <>
            {contextHolder}

            <Modal
                title={
                    <Space>
                        {editTeam ? <EditOutlined /> : <PlusOutlined />}
                        {editTeam ? "Modifier l'équipe" : "Nouvelle équipe"}
                    </Space>
                }
                open={open}
                onCancel={onClose}
                onOk={handleSubmit}
                okText={editTeam ? "Enregistrer" : "Créer"}
                cancelText="Annuler"
                confirmLoading={saving}
                destroyOnHidden
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
        </>
    );
}

export default TeamFormModal;
