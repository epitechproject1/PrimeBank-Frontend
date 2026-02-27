import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Switch, message } from "antd";
import type {
    DepartmentType,
    CreateDepartmentPayload,
    UpdateDepartmentPayload,
} from "../../types/departments.type";
import { departmentService } from "../../services/departments.service";
import type { UserProfile } from "../../../users";
import axios from "axios";
import { getErrorMessage } from "../../services/httpError";

type FormValues = {
    name: string;
    description: string;
    director_id: number;
    is_active?: boolean;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
    editDepartment?: DepartmentType | null;
    users: UserProfile[];
    loadingUsers?: boolean;
};

function buildPayload(values: FormValues): CreateDepartmentPayload {
    return {
        name: (values.name ?? "").trim(),
        description: (values.description ?? "").trim() || null,
        director_id: values.director_id ?? null,
        is_active: values.is_active ?? true,
    };
}

async function saveDepartment(
    editDepartment: DepartmentType | null | undefined,
    values: FormValues
) {
    const payload = buildPayload(values);

    if (editDepartment) {
        const updatePayload: UpdateDepartmentPayload = payload;
        await departmentService.update(editDepartment.id, updatePayload);
        return "Département modifié";
    }

    await departmentService.create(payload);
    return "Département créé";
}

export default function DepartmentFormModal({
                                                open,
                                                onClose,
                                                onSaved,
                                                editDepartment,
                                                users,
                                                loadingUsers = false,
                                            }: Props) {
    const [form] = Form.useForm<FormValues>();
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;

        form.setFieldsValue({
            name: editDepartment?.name ?? "",
            description: editDepartment?.description ?? "",
            director_id: editDepartment?.director?.id ?? (undefined as any),
            is_active: editDepartment?.is_active ?? true,
        });

        form.setFields([
            { name: "name", errors: [] },
            { name: "description", errors: [] },
            { name: "director_id", errors: [] },
        ]);
    }, [open, editDepartment, form]);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const values = await form.validateFields();
            const successMsg = await saveDepartment(editDepartment, values);

            message.success(successMsg);
            onSaved();
            onClose();
            form.resetFields();
        } catch (err: any) {
            if (err?.errorFields) return;

            if (axios.isAxiosError(err)) {
                const data: any = err.response?.data;

                if (data?.name) {
                    const msg = Array.isArray(data.name) ? data.name[0] : String(data.name);
                    form.setFields([{ name: "name", errors: [msg] }]);
                    message.error(msg);
                    return;
                }

                if (data?.description) {
                    const msg = Array.isArray(data.description) ? data.description[0] : String(data.description);
                    form.setFields([{ name: "description", errors: [msg] }]);
                    message.error(msg);
                    return;
                }

                if (data?.director_id) {
                    const msg = Array.isArray(data.director_id) ? data.director_id[0] : String(data.director_id);
                    form.setFields([{ name: "director_id", errors: [msg] }]);
                    message.error(msg);
                    return;
                }

                if (data?.detail) {
                    message.error(String(data.detail));
                    return;
                }

                if (Array.isArray(data) && data[0]) {
                    message.error(String(data[0]));
                    return;
                }
            }

            const msg = await getErrorMessage(err, "Erreur lors de l'enregistrement");
            message.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        onClose();
        form.resetFields();
    };

    return (
        <Modal
            open={open}
            title={editDepartment ? "Modifier Département" : "Créer Département"}
            onOk={handleSubmit}
            okText={editDepartment ? "Enregistrer" : "Créer"}
            confirmLoading={saving}
            onCancel={handleCancel}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Nom"
                    rules={[{ required: true, message: "Nom obligatoire" }]}
                >
                    <Input
                        placeholder="Ex: Engineering"
                        onChange={() => form.setFields([{ name: "name", errors: [] }])}
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        { required: true, message: "Description obligatoire" },
                        {
                            validator: (_, v) =>
                                typeof v === "string" && v.trim().length >= 5
                                    ? Promise.resolve()
                                    : Promise.reject(new Error("Minimum 5 caractères")),
                        },
                    ]}
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Description du département"
                        onChange={() => form.setFields([{ name: "description", errors: [] }])}
                    />
                </Form.Item>

                <Form.Item
                    name="director_id"
                    label="Directeur"
                    rules={[{ required: true, message: "Directeur obligatoire" }]}
                >
                    <Select
                        allowClear
                        placeholder="Choisir un directeur"
                        loading={loadingUsers}
                        options={users.map((u) => ({
                            value: u.id,
                            label: `${u.first_name} ${u.last_name}`,
                        }))}
                        showSearch
                        optionFilterProp="label"
                        onChange={() => form.setFields([{ name: "director_id", errors: [] }])}
                    />
                </Form.Item>

                <Form.Item name="is_active" label="Actif" valuePropName="checked">
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
}