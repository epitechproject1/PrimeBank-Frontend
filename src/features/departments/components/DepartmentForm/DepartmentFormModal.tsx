import { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Select, Switch, message } from "antd";
import type { DepartmentType, CreateDepartmentPayload, UpdateDepartmentPayload } from "../../types/departments.type";
import { departmentService } from "../../services/departments.service";
import type { UserProfile } from "../../../users";
import axios, { type AxiosError } from "axios";
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

type FieldName = keyof Pick<FormValues, "name" | "description" | "director_id">;

type ApiFieldErrors = Partial<Record<FieldName, string[] | string>> & {
    detail?: string;
};

function buildPayload(values: FormValues): CreateDepartmentPayload {
    return {
        name: (values.name ?? "").trim(),
        description: (values.description ?? "").trim() || null,
        director_id: values.director_id ?? null,
        is_active: values.is_active ?? true,
    };
}

async function saveDepartment(editDepartment: DepartmentType | null | undefined, values: FormValues) {
    const payload = buildPayload(values);

    if (editDepartment) {
        const updatePayload: UpdateDepartmentPayload = payload;
        await departmentService.update(editDepartment.id, updatePayload);
        return "Département modifié";
    }

    await departmentService.create(payload);
    return "Département créé";
}

function firstMsg(v: unknown): string | null {
    if (!v) return null;
    if (Array.isArray(v)) return v[0] ? String(v[0]) : null;
    return String(v);
}

function tryApplyFieldErrors(form: ReturnType<typeof Form.useForm<FormValues>>[0], err: unknown): boolean {
    if (!axios.isAxiosError(err)) return false;

    const data = (err as AxiosError).response?.data as unknown;

    if (Array.isArray(data)) {
        const msg = firstMsg(data);
        if (msg) message.error(msg);
        return true;
    }

    if (data && typeof data === "object") {
        const obj = data as ApiFieldErrors;

        const fields: FieldName[] = ["name", "description", "director_id"];
        for (const f of fields) {
            const msg = firstMsg(obj[f]);
            if (msg) {
                form.setFields([{ name: f, errors: [msg] }]);
                message.error(msg);
                return true;
            }
        }

        if (obj.detail) {
            message.error(String(obj.detail));
            return true;
        }
    }

    return false;
}

function resetTouchedErrors(form: ReturnType<typeof Form.useForm<FormValues>>[0], changed: Partial<FormValues>) {
    const keys: FieldName[] = ["name", "description", "director_id"];
    keys.forEach((k) => {
        if (k in changed) form.setFields([{ name: k, errors: [] }]);
    });
}

function getInitialFormValues(editDepartment?: DepartmentType | null): Partial<FormValues> {
    return {
        name: editDepartment?.name ?? "",
        description: editDepartment?.description ?? "",
        director_id: editDepartment?.director?.id ?? (undefined as unknown as number),
        is_active: editDepartment?.is_active ?? true,
    };
}

/* ✅ Extracted component to reduce lines in DepartmentFormModal */
function DepartmentFormFields({
                                  form,
                                  directorOptions,
                                  loadingUsers,
                              }: {
    form: ReturnType<typeof Form.useForm<FormValues>>[0];
    directorOptions: { value: number; label: string }[];
    loadingUsers: boolean;
}) {
    return (
        <Form form={form} layout="vertical" onValuesChange={(changed) => resetTouchedErrors(form, changed)}>
            <Form.Item name="name" label="Nom" rules={[{ required: true, message: "Nom obligatoire" }]}>
                <Input placeholder="Ex: Engineering" />
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
                <Input.TextArea rows={3} placeholder="Description du département" />
            </Form.Item>

            <Form.Item name="director_id" label="Directeur" rules={[{ required: true, message: "Directeur obligatoire" }]}>
                <Select
                    allowClear
                    placeholder="Choisir un directeur"
                    loading={loadingUsers}
                    options={directorOptions}
                    showSearch
                    optionFilterProp="label"
                />
            </Form.Item>

            <Form.Item name="is_active" label="Actif" valuePropName="checked">
                <Switch />
            </Form.Item>
        </Form>
    );
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

    const title = editDepartment ? "Modifier Département" : "Créer Département";
    const okText = editDepartment ? "Enregistrer" : "Créer";

    const directorOptions = useMemo(
        () =>
            users.map((u) => ({
                value: u.id,
                label: `${u.first_name} ${u.last_name}`.trim(),
            })),
        [users]
    );

    useEffect(() => {
        if (!open) return;
        form.setFieldsValue(getInitialFormValues(editDepartment));
        form.setFields([
            { name: "name", errors: [] },
            { name: "description", errors: [] },
            { name: "director_id", errors: [] },
        ]);
    }, [open, editDepartment, form]);

    const closeAndReset = () => {
        onClose();
        form.resetFields();
    };

    const handleSubmit = async () => {
        setSaving(true);

        try {
            const values = await form.validateFields();
            const successMsg = await saveDepartment(editDepartment, values);

            message.success(successMsg);
            onSaved();
            closeAndReset();
        } catch (err: unknown) {
            if (typeof err === "object" && err && "errorFields" in err) return;
            if (tryApplyFieldErrors(form, err)) return;

            const msg = await getErrorMessage(err, "Erreur lors de l'enregistrement");
            message.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={open}
            title={title}
            onOk={handleSubmit}
            okText={okText}
            confirmLoading={saving}
            onCancel={closeAndReset}
            destroyOnClose
        >
            <DepartmentFormFields form={form} directorOptions={directorOptions} loadingUsers={loadingUsers} />
        </Modal>
    );
}