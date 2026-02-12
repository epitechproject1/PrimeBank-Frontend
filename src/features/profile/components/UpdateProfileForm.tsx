import React, { useEffect } from "react";
import { Form, Input, Button, Card, Row, Col, Space } from "antd";
import type { User } from "../../users/types/user.type";

interface UpdateProfileFormProps {
    user: User | undefined;
    loading: boolean;
    onSubmit: (values: Partial<User>) => void;
}

export const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
    user,
    loading,
    onSubmit,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number,
                email: user.email,
            });
        }
    }, [user, form]);

    const handleSubmit = async () => {
        const values = await form.validateFields();
        onSubmit(values);
    };

    const handleReset = () => {
        if (!user) return;
        form.setFieldsValue({
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number,
            email: user.email,
        });
    };

    return (
        <Card title="Informations personnelles" style={{ marginBottom: 16 }}>
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="first_name"
                            label="Prenom"
                            rules={[{ required: true, message: "Le prenom est requis" }]}
                        >
                            <Input size="large" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="last_name"
                            label="Nom"
                            rules={[{ required: true, message: "Le nom est requis" }]}
                        >
                            <Input size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="email" label="Email">
                    <Input size="large" disabled />
                </Form.Item>

                <Form.Item name="phone_number" label="Telephone">
                    <Input size="large" />
                </Form.Item>

                <Space>
                    <Button onClick={handleReset}>Annuler</Button>
                    <Button type="primary" loading={loading} onClick={handleSubmit} size="large">
                        Mettre a jour
                    </Button>
                </Space>
            </Form>
        </Card>
    );
};
