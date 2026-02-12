import { Form, Input, Select, Spin } from "antd";
import { FormInstance } from "antd/es/form";
import {SelectOption} from "../utils/team-select-options.tsx";

interface TeamFormFieldsProps {
    form: FormInstance;
    loadingOptions: boolean;
    userOptions: SelectOption[];
    deptOptions: SelectOption[];
}

export function TeamFormFields({ form, loadingOptions, userOptions, deptOptions }: TeamFormFieldsProps) {
    return (
        <Form form={form} layout="vertical">
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

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "La description est obligatoire" }]}
            >
                <Input.TextArea
                    placeholder="Décrivez le rôle de cette équipe..."
                    rows={3}
                    showCount
                    maxLength={255}
                />
            </Form.Item>

            <Form.Item
                name="owner_id"
                label="Responsable"
                rules={[{ required: true, message: "Le choix du responsable est obligatoire" }]}
            >
                <Select
                    showSearch
                    options={userOptions}
                    filterOption={(input, option) =>
                        ((option as SelectOption)?.searchLabel ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
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
    );
}