import { Button, Checkbox, Form, Input, Modal, Space } from "antd";

export type ContractTypeFormValues = {
    name: string;
    code: string;
    description?: string;
    requires_end_date: boolean;
};

interface ContractTypeFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: ContractTypeFormValues) => void;
    submitting?: boolean;
}

export function ContractTypeFormModal({
    open,
    onClose,
    onSubmit,
    submitting = false,
}: ContractTypeFormModalProps) {
    const [form] = Form.useForm<ContractTypeFormValues>();

    const handleFinish = (values: ContractTypeFormValues) => {
        onSubmit(values);
    };

    return (
        <Modal
            title="Ajouter un type de contrat"
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ requires_end_date: false }}
            >
                <Form.Item
                    name="name"
                    label="Nom"
                    rules={[{ required: true, message: "Le nom est requis" }]}
                >
                    <Input placeholder="Ex: CDI" />
                </Form.Item>

                <Form.Item
                    name="code"
                    label="Code"
                    rules={[{ required: true, message: "Le code est requis" }]}
                >
                    <Input placeholder="Ex: CDI" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} placeholder="Description optionnelle" />
                </Form.Item>

                <Form.Item name="requires_end_date" valuePropName="checked">
                    <Checkbox>Ce type de contrat necessite une date de fin</Checkbox>
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
