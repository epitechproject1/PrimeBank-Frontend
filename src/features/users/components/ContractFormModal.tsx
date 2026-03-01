import { Button, DatePicker, Form, InputNumber, Modal, Select, Space } from "antd";
import type { Dayjs } from "dayjs";
import type { ContractType } from "../../contract_types/types/contract_type.types";

const { Option } = Select;

export type ContractFormValues = {
    contract_type: number;
    start_date: Dayjs;
    end_date?: Dayjs | null;
    weekly_hours_target: number;
};

interface ContractFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: ContractFormValues) => void;
    contractTypes: ContractType[];
    loadingTypes?: boolean;
    submitting?: boolean;
    onOpenCreateType: () => void;
}

export function ContractFormModal({
    open,
    onClose,
    onSubmit,
    contractTypes,
    loadingTypes = false,
    submitting = false,
    onOpenCreateType,
}: ContractFormModalProps) {
    const [form] = Form.useForm<ContractFormValues>();

    const handleFinish = (values: ContractFormValues) => {
        onSubmit(values);
    };

    return (
        <Modal
            title="Ajouter un contrat"
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    name="contract_type"
                    label="Type de contrat"
                    rules={[{ required: true, message: "Le types est requis" }]}
                >
                    <Select placeholder="Selectionner un type de contrat" loading={loadingTypes}>
                        {contractTypes.map((type) => (
                            <Option key={type.id} value={type.id}>
                                {type.name} ({type.code})
                            </Option>
                        ))}
                    </Select>
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
                        label="Date de fin"
                        style={{ flex: 1 }}
                        dependencies={["contract_type", "start_date"]}
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value: Dayjs | null) {
                                    const selectedTypeId = getFieldValue("contract_type");
                                    const startDate = getFieldValue("start_date") as Dayjs | undefined;
                                    const selectedType = contractTypes.find(
                                        (type) => type.id === selectedTypeId
                                    );

                                    if (selectedType?.requires_end_date && !value) {
                                        return Promise.reject(
                                            new Error("Date de fin requise pour ce types de contrat")
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
                        Enregistrer
                    </Button>
                </Space>
            </Form>
        </Modal>
    );
}
