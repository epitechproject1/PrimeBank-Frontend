import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Switch, message } from "antd";
import type {
    DepartmentType,
    CreateDepartmentPayload,
    UpdateDepartmentPayload,
} from "../../types/departments.type";
import { departmentService } from "../../services/departments.service";
import type { UserProfile } from "../../../users";
import type { AxiosError } from "axios";

type FormValues = {
    name: string;
    description?: string | null;
    director_id?: number | null;
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

function getErrMsg(err: unknown, fallback: string) {
    const ax = err as AxiosError<{ detail?: string; message?: string }>;
    return (
        ax?.response?.data?.detail ||
        ax?.response?.data?.message ||
        (err instanceof Error ? err.message : fallback)
    );
}

function buildPayload(values: FormValues): CreateDepartmentPayload {
    return {
        name: values.name,
        description: values.description ?? null,
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
            description: editDepartment?.description ?? null,
            director_id: editDepartment?.director?.id ?? null,
            is_active: editDepartment?.is_active ?? true,
        });
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
        } catch (err: unknown) {
            message.error(getErrMsg(err, "Erreur lors de l'enregistrement"));
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
                <Form.Item name="name" label="Nom" rules={[{ required: true, message: "Nom obligatoire" }]}>
                    <Input placeholder="Ex: Engineering" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} placeholder="Description du département" />
                </Form.Item>

                <Form.Item name="director_id" label="Directeur">
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
                    />
                </Form.Item>

                <Form.Item name="is_active" label="Actif" valuePropName="checked">
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
}
