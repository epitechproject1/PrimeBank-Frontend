import { Modal, Form, Input, Button, Space, Typography, theme } from "antd";
import type { FormInstance } from "antd";
import type { WeekPattern } from "../types/weekPattern.types";

const { Text } = Typography;

type FormValues = {
    name: string;
    description?: string;
};

type Props = {
    open: boolean;
    editing: WeekPattern | null;
    form: FormInstance<FormValues>;
    onCancel: () => void;
    onSubmit: (values: FormValues) => void;
};

export function WeekPatternFormModal({
                                         open,
                                         editing,
                                         form,
                                         onCancel,
                                         onSubmit,
                                     }: Props) {
    const { token } = theme.useToken();

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            title={editing ? "Modifier la semaine type" : "Créer une semaine type"}
            destroyOnClose
        >
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <Text type="secondary">
                    Définissez le nom et une description pour votre semaine type.
                </Text>

                <Form layout="vertical" form={form} onFinish={onSubmit}>
                    <Form.Item
                        label="Nom"
                        name="name"
                        rules={[{ required: true, message: "Nom requis" }]}
                    >
                        <Input size="large" placeholder="Ex : Semaine standard 35h" />
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <Input.TextArea
                            rows={3}
                            placeholder="Optionnel"
                            style={{
                                background: token.colorBgContainer,
                            }}
                        />
                    </Form.Item>

                    <div
                        style={{
                            marginTop: 8,
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 8,
                        }}
                    >
                        <Button onClick={onCancel}>Annuler</Button>
                        <Button type="primary" htmlType="submit">
                            {editing ? "Enregistrer" : "Créer"}
                        </Button>
                    </div>
                </Form>
            </Space>
        </Modal>
    );
}