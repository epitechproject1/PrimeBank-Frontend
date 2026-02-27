import { Form, Input, Select, Modal } from "antd";
import type { FormInstance } from "antd/es/form";
import type { DefaultOptionType } from "antd/es/select";
import type { SelectOption } from "../form/team-select-options";

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

function handleTeamFormValuesChange(
    form: FormInstance,
    changed: Partial<TeamFormValues>,
    allValues: TeamFormValues
) {
    if ("members_ids" in changed) {
        const ownerId = allValues.owner_id;
        const members = allValues.members_ids ?? [];

        if (ownerId && !members.includes(ownerId)) {
            Modal.warning({
                title: "Action impossible",
                content: "Le responsable ne peut pas être supprimé des membres de l’équipe.",
            });

            form.setFieldsValue({ members_ids: [...members, ownerId] });
        }
    }

    if ("owner_id" in changed) {
        const newOwner = allValues.owner_id;
        const members = allValues.members_ids ?? [];

        if (newOwner && !members.includes(newOwner)) {
            form.setFieldsValue({ members_ids: [...members, newOwner] });
        }
    }
}

const atLeastOneMemberRule = {
    validator: async (_: any, value: number[] | undefined) => {
        const arr = Array.isArray(value) ? value : [];
        if (arr.length < 1) {
            throw new Error("Au moins un membre requis");
        }
    },
};

export function TeamFormFields({
                                   form,
                                   loadingOptions,
                                   userOptions,
                                   deptOptions,
                               }: TeamFormFieldsProps) {
    const filterBySearchLabel = (input: string, option?: DefaultOptionType) => {
        const needle = input.trim().toLowerCase();
        const opt = option as DefaultOptionType & { searchLabel?: string };
        const hay = String(opt?.searchLabel ?? opt?.label ?? "").toLowerCase();
        return hay.includes(needle);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={(changed, allValues) =>
                handleTeamFormValuesChange(
                    form,
                    changed as Partial<TeamFormValues>,
                    allValues as TeamFormValues
                )
            }
        >
            <Form.Item
                name="name"
                label="Nom de l'équipe"
                rules={[
                    { required: true, message: "Le nom est obligatoire" },
                    { whitespace: true, message: "Le nom ne peut pas être vide" },
                    { min: 2, message: "Minimum 2 caractères" },
                    { max: 150, message: "Maximum 150 caractères" },
                ]}
            >
                <Input
                    maxLength={150}
                    showCount
                    placeholder="Ex: Engineering"
                    onChange={() => form.setFields([{ name: "name", errors: [] }])}
                />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[
                    { required: true, message: "La description est obligatoire" },
                    { whitespace: true, message: "La description ne peut pas être vide" },
                    { min: 2, message: "Minimum 2 caractères" },
                    { max: 255, message: "Maximum 255 caractères" },
                ]}
            >
                <Input.TextArea
                    rows={3}
                    maxLength={255}
                    showCount
                    placeholder="Décrivez brièvement l'équipe"
                    onChange={() => form.setFields([{ name: "description", errors: [] }])}
                />
            </Form.Item>

            <Form.Item
                name="owner_id"
                label="Responsable"
                rules={[{ required: true, message: "Responsable obligatoire" }]}
            >
                <Select
                    showSearch
                    options={userOptions}
                    filterOption={filterBySearchLabel}
                    placeholder="Choisir un responsable"
                    loading={loadingOptions}
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
                    filterOption={filterBySearchLabel}
                    placeholder="Choisir un département"
                />
            </Form.Item>

            <Form.Item
                name="members_ids"
                label="Membres"
                rules={[atLeastOneMemberRule]}
            >
                <Select
                    mode="multiple"
                    showSearch
                    options={userOptions}
                    filterOption={filterBySearchLabel}
                    placeholder="Sélectionner les membres"
                    loading={loadingOptions}
                />
            </Form.Item>
        </Form>
    );
}