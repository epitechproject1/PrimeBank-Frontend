import { Form, Input, Modal } from "antd";

export interface ChangePasswordPayload {
    old_password: string;
    new_password: string;
}

interface ChangePasswordFormProps {
    open: boolean;
    loading: boolean;
    onCancel: () => void;
    onSubmit: (values: ChangePasswordPayload) => Promise<void> | void;
}

export const ChangePasswordForm = ({
    open,
    loading,
    onCancel,
    onSubmit,
}: ChangePasswordFormProps) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        const values = await form.validateFields();
        await onSubmit({
            old_password: values.old_password,
            new_password: values.new_password,
        });
        form.resetFields();
    };

    return (
        <Modal
            open={open}
            title="Changer mot de passe"
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="old_password"
                    label="Ancien mot de passe"
                    rules={[{ required: true, message: "Champ requis" }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="new_password"
                    label="Nouveau mot de passe"
                    rules={[
                        { required: true, message: "Champ requis" },
                        { min: 8, message: "Minimum 8 caracteres" },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm_password"
                    label="Confirmer mot de passe"
                    dependencies={["new_password"]}
                    rules={[
                        { required: true, message: "Champ requis" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("new_password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Les mots de passe ne correspondent pas"));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    );
};
