import { Button, DatePicker, Form, InputNumber, Modal, Select, Space } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { ContractType } from "../../contract_types/types/contract_type.types";
import type { User } from "../../users/types/user.type";
import type { Contract } from "../types/contract.types";

type ContractCreateValues = {
    user: number;
    contract_type: number;
    start_date: Dayjs;
    end_date?: Dayjs | null;
    weekly_hours_target: number;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: ContractCreateValues) => void;
    users: User[];
    contractTypes: ContractType[];
    loadingUsers?: boolean;
    loadingTypes?: boolean;
    submitting?: boolean;
    onOpenCreateType: () => void;
    editingContract?: Contract | null;
};

export function ContractCreateModal({
    open,
    onClose,
    onSubmit,
    users,
    contractTypes,
    loadingUsers = false,
    loadingTypes = false,
    submitting = false,
    onOpenCreateType,
    editingContract = null,
}: Props) {
    const [form] = Form.useForm<ContractCreateValues>();
    const isEditing = !!editingContract;

    const initialValues: Partial<ContractCreateValues> | undefined = editingContract
        ? {
              user: editingContract.user,
              contract_type: editingContract.contract_type,
              start_date: dayjs(editingContract.start_date),
              end_date: editingContract.end_date ? dayjs(editingContract.end_date) : null,
              weekly_hours_target: Number(editingContract.weekly_hours_target || 0),
          }
        : undefined;

    return (
        <Modal
            title={isEditing ? "Modifier le contrat" : "Nouveau contrat"}
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={onSubmit} initialValues={initialValues}>
                <Form.Item
                    name="user"
                    label="Utilisateur"
                    rules={[{ required: true, message: "Selectionnez un utilisateur" }]}
                >
                    <Select
                        showSearch
                        placeholder="Selectionner un utilisateur"
                        loading={loadingUsers}
                        optionFilterProp="label"
                        options={users.map((u) => ({
                            value: Number(u.id),
                            label: `${u.first_name} ${u.last_name} (${u.email})`,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="contract_type"
                    label="Type de contrat"
                    rules={[{ required: true, message: "Le type est requis" }]}
                >
                    <Select
                        showSearch
                        placeholder="Selectionner un type de contrat"
                        loading={loadingTypes}
                        optionFilterProp="label"
                        options={contractTypes.map((type) => ({
                            value: type.id,
                            label: `${type.name} (${type.code})`,
                        }))}
                    />
                </Form.Item>

                <div style={{ marginBottom: 12, textAlign: "right" }}>
                    <Button type="link" onClick={onOpenCreateType} style={{ padding: 0 }}>
                        Ajouter un type de contrat
                    </Button>
                </div>

                <Space size={12} style={{ display: "flex" }}>
                    <Form.Item
                        name="start_date"
                        label="Date debut"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: "Date debut requise" }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        name="end_date"
                        label="Date fin"
                        style={{ flex: 1 }}
                        dependencies={["contract_type", "start_date"]}
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value: Dayjs | null) {
                                    const selectedType = contractTypes.find(
                                        (type) => type.id === getFieldValue("contract_type")
                                    );
                                    const startDate = getFieldValue("start_date") as Dayjs | undefined;

                                    if (selectedType?.requires_end_date && !value) {
                                        return Promise.reject(
                                            new Error("Date de fin requise pour ce type")
                                        );
                                    }

                                    if (value && startDate && value.isBefore(startDate, "day")) {
                                        return Promise.reject(
                                            new Error("La date de fin doit etre apres la date de debut")
                                        );
                                    }

                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Space>

                <Form.Item
                    name="weekly_hours_target"
                    label="Heures par semaine"
                    rules={[{ required: true, message: "Heures requises" }]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        min={1}
                        max={999.99}
                        step={0.5}
                        placeholder="Ex: 35"
                    />
                </Form.Item>

                <Space style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button onClick={onClose}>Annuler</Button>
                    <Button type="primary" loading={submitting} onClick={() => form.submit()}>
                        {isEditing ? "Modifier" : "Creer"}
                    </Button>
                </Space>
            </Form>
        </Modal>
    );
}

export type { ContractCreateValues };
