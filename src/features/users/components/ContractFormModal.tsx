import { Button, Form, Input, Modal, Select, DatePicker, Space, Typography } from "antd";

const { Text } = Typography;
const { Option } = Select;

export type ContractFormValues = {
    type_contrat: string;
    date_debut: string;
    date_fin: string;
    heures_par_semaine: string;
    planning: "35h" | "20h" | "Temps partiel";
};

interface ContractFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: ContractFormValues) => void;
}

export function ContractFormModal({ open, onClose, onSubmit }: ContractFormModalProps) {
    const [form] = Form.useForm();

    const handleFinish = (values: ContractFormValues) => {
        onSubmit(values);
        form.resetFields();
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
                    name="type_contrat"
                    label="Type de contrat"
                    rules={[{ required: true, message: "Le type est requis" }]}
                >
                    <Input placeholder="ex: CDI" />
                </Form.Item>

                <Space size={12} style={{ display: "flex" }}>
                    <Form.Item
                        name="date_debut"
                        label="Date debut"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: "Date debut requise" }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        name="date_fin"
                        label="Date de fin"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: "Date de fin requise" }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Space>

                <Form.Item
                    name="heures_par_semaine"
                    label="Heures par semaine"
                    rules={[{ required: true, message: "Heures requises" }]}
                >
                    <Input placeholder="35h" />
                </Form.Item>

                <Form.Item
                    name="planning"
                    label="Planning"
                    rules={[{ required: true, message: "Planning requis" }]}
                >
                    <Select placeholder="Choisir un planning">
                        <Option value="35h">35h</Option>
                        <Option value="20h">20h</Option>
                        <Option value="Temps partiel">Temps partiel</Option>
                    </Select>
                </Form.Item>

                <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
                    Cette action est un mock. L'API sera branchee plus tard.
                </Text>

                <Space style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button onClick={onClose}>Annuler</Button>
                    <Button type="primary" onClick={() => form.submit()}>
                        Enregistrer
                    </Button>
                </Space>
            </Form>
        </Modal>
    );
}
