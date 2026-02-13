import { Form, Input, Select, Modal } from "antd";
import type { FormInstance } from "antd/es/form";
import type { SelectOption } from "../utils/team-select-options";

interface TeamFormFieldsProps {
    form: FormInstance;
    loadingOptions: boolean;
    userOptions: SelectOption[];
    deptOptions: SelectOption[];
}

type TeamFormValues = {
    name: string;
    description?: string;
    owner_id: number;
    department_id: number;
    members_ids?: number[];
};

export function TeamFormFields({
                                   form,
                                   loadingOptions,
                                   userOptions,
                                   deptOptions,
                               }: TeamFormFieldsProps) {

    const onValuesChange = (
        changed: Partial<TeamFormValues>,
        allValues: TeamFormValues
    ) => {

        if ("members_ids" in changed) {
            const ownerId = allValues.owner_id;
            const members = allValues.members_ids ?? [];

            if (ownerId && !members.includes(ownerId)) {
                Modal.warning({
                    title: "Action impossible",
                    content:
                        "Le responsable ne peut pas être supprimé des membres de l’équipe.",
                });

                form.setFieldsValue({
                    members_ids: [...members, ownerId],
                });
            }
        }

        if ("owner_id" in changed) {
            const newOwner = allValues.owner_id;
            const members = allValues.members_ids ?? [];

            if (newOwner && !members.includes(newOwner)) {
                form.setFieldsValue({
                    members_ids: [...members, newOwner],
                });
            }
        }
    };

    return (
        <Form form={form} layout="vertical" onValuesChange={onValuesChange}>

            <Form.Item
                name="name"
                label="Nom de l'équipe"
                rules={[{ required: true, message: "Le nom est obligatoire" }]}
            >
                <Input maxLength={150} showCount />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "La description est obligatoire" }]}
            >
                <Input.TextArea rows={3} maxLength={255} showCount />
            </Form.Item>

            <Form.Item
                name="owner_id"
                label="Responsable"
                rules={[{ required: true, message: "Responsable obligatoire" }]}
            >
                <Select
                    showSearch
                    options={userOptions}
                />
            </Form.Item>

            <Form.Item
                name="department_id"
                label="Département"
                rules={[{ required: true, message: "Département obligatoire" }]}
            >
                <Select
                    showSearch
                    loading={loadingOptions}
                    options={deptOptions}
                />
            </Form.Item>

            <Form.Item
                name="members_ids"
                label="Membres"
                rules={[{ required: true, message: "Au moins un membre requis" }]}
            >
                <Select
                    mode="multiple"
                    showSearch
                    options={userOptions}
                    placeholder="Sélectionner les membres"
                />
            </Form.Item>
        </Form>
    );
}
