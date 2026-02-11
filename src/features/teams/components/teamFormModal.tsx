import { useEffect, useState } from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Space,
    Avatar,
    Spin,
    message,
} from "antd";
import {
    EditOutlined,
    PlusOutlined,
    UserOutlined,
    BankOutlined,
} from "@ant-design/icons";
import { teamService } from "../services/teams.service.ts";
import { TeamType, CreateTeamPayload } from "../types/teams.type.ts";
import { apiClient } from "../../../lib/api_client/apiClient.ts";
import { UserProfile } from "../../users/types/user.type.ts";
import { department } from "../../departments/types/departments.type.ts";


interface TeamFormModalProps {
    open: boolean;
    editTeam: TeamType | null;
    onClose: () => void;
    onSaved: (team: TeamType) => void;
}


async function fetchUsers(): Promise<UserProfile[]> {
    const { data } = await apiClient.get<UserProfile[]>("/users/");
    return data;
}

async function fetchDepartments(): Promise<department[]> {
    const { data } = await apiClient.get<department[]>("/departments/");
    return data;
}


export function TeamFormModal({ open, editTeam, onClose, onSaved }: TeamFormModalProps) {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const [saving, setSaving] = useState(false);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [departments, setDepartments] = useState<department[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);


    useEffect(() => {
        if (!open) return;

        setLoadingOptions(true);
        Promise.all([fetchUsers(), fetchDepartments()])
            .then(([usersData, deptsData]) => {
                setUsers(usersData);
                setDepartments(deptsData);
            })
            .catch(() => {
                messageApi.warning("Impossible de charger les utilisateurs ou départements");
            })
            .finally(() => setLoadingOptions(false));
    }, [open]);


    useEffect(() => {
        if (!open) return;

        if (editTeam) {
            form.setFieldsValue({
                name: editTeam.name,
                description: editTeam.description,
                owner_id: editTeam.owner?.id,
                department_id: editTeam.department?.id,
            });
        } else {
            form.resetFields();
        }
    }, [open, editTeam, form]);


    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);
            let result: TeamType;

            const payload: CreateTeamPayload = {
                name: values.name,
                description: values.description || null,
                owner_id: values.owner_id,
                department_id: values.department_id,
            };

            if (editTeam && editTeam.id) {
                result = await teamService.partialUpdate(editTeam.id, payload);
                messageApi.success("Équipe modifiée !");
            } else {
                result = await teamService.create(payload);
                messageApi.success("Équipe créée !");
            }

            onSaved(result);
            onClose();
        } catch (err: any) {
            if (err?.errorFields) return;
            messageApi.error(err?.response?.data?.detail || "Erreur lors de la sauvegarde");
        } finally {
            setSaving(false);
        }
    };

    const userOptions = users.map((u) => ({
        value: u.id,
        label: (
            <Space>
                <Avatar size={20} icon={<UserOutlined />} />
                {u.first_name} {u.last_name}
                <span style={{ color: "#888", fontSize: 12 }}>({u.email})</span>
            </Space>
        ),
        searchLabel: `${u.first_name} ${u.last_name} ${u.email}`,
    }));

    const deptOptions = departments.map((d) => ({
        value: d.id,
        label: (
            <Space>
                <BankOutlined />
                {d.name}
            </Space>
        ),
        searchLabel: d.name,
    }));


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
                destroyOnClose
                width={520}
            >
                <Spin spinning={loadingOptions}>
                    <Form form={form} layout="vertical" style={{ marginTop: 16 }}>

                        <Form.Item
                            name="name"
                            label="Nom de l'équipe"
                            rules={[{ required: true, message: "Le nom est obligatoire" }]}
                        >
                            <Input
                                placeholder="Ex: Frontend Squad"
                                autoFocus
                                maxLength={150}
                                showCount
                            />
                        </Form.Item>

                        <Form.Item name="description" label="Description">
                            <Input.TextArea
                                placeholder="Décrivez le rôle de cette équipe..."
                                rows={3}
                                showCount
                                maxLength={255}
                            />
                        </Form.Item>

                        {/* Responsable */}
                        <Form.Item
                            name="owner_id"
                            label="Responsable"
                            rules={[{ required: true, message: "Le responsable est obligatoire" }]}
                        >
                            <Select
                                placeholder="Sélectionner un responsable"
                                showSearch
                                loading={loadingOptions}
                                filterOption={(input, option) =>
                                    (option?.searchLabel ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                options={userOptions}
                                notFoundContent={
                                    loadingOptions ? <Spin size="small" /> : "Aucun utilisateur"
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name="department_id"
                            label="Département"
                            rules={[{ required: true, message: "Le département est obligatoire" }]}
                        >
                            <Select
                                placeholder="Sélectionner un département"
                                showSearch
                                loading={loadingOptions}
                                filterOption={(input, option) =>
                                    (option?.searchLabel ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                options={deptOptions}
                                notFoundContent={
                                    loadingOptions ? <Spin size="small" /> : "Aucun département"
                                }
                            />
                        </Form.Item>

                    </Form>
                </Spin>
            </Modal>
        </>
    );
}

export default TeamFormModal;