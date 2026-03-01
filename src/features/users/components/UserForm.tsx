// src/features/users/components/UserForm.tsx

import { Button, Form, Input, Modal, Select } from "antd";
import { User } from "../types/user.type";

const { Option } = Select;

type UserFormValues = {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    password?: string;
    confirm_password?: string;
    role: "admin" | "manager" | "user";
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: UserFormValues) => void;
    user?: User | null;
    loading?: boolean;
};

export default function UserForm({ open, onClose, onSubmit, user, loading }: Props) {
    const [form] = Form.useForm();
    const isEditing = !!user;

    const handleFinish = (values: UserFormValues) => {
        const payload = {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            phone_number: values.phone_number,
            password: values.password,
            role: values.role,
        };
        onSubmit(payload);
        form.resetFields();
    };

    return (
        <Modal
            title={isEditing ? "Modifier l'utilisateur" : "Creer un utilisateur"}
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Annuler
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={() => form.submit()}
                >
                    {isEditing ? "Modifier" : "Creer"}
                </Button>,
            ]}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={user || { role: "user" }}
            >
                <Form.Item
                    name="first_name"
                    label="Prenom"
                    rules={[{ required: true, message: "Le prenom est requis" }]}
                >
                    <Input placeholder="Jean" />
                </Form.Item>

                <Form.Item
                    name="last_name"
                    label="Nom"
                    rules={[{ required: true, message: "Le nom est requis" }]}
                >
                    <Input placeholder="Dupont" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "L'email est requis" },
                        { type: "email", message: "Email invalide" },
                    ]}
                >
                    <Input placeholder="jean.dupont@exemple.com" disabled={isEditing} />
                </Form.Item>

                <Form.Item name="phone_number" label="Telephone">
                    <Input placeholder="+33 6 12 34 56 78" />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: "Le role est requis" }]}
                >
                    <Select placeholder="Selectionnez un role">
                        <Option value="admin">Administrateur</Option>
                        <Option value="manager">Manager</Option>
                        <Option value="user">Utilisateur</Option>
                    </Select>
                </Form.Item>

                {!isEditing && (
                    <>
                        <Form.Item
                            name="password"
                            label="Mot de passe"
                            extra="Minimum 8 caracteres avec majuscule, minuscule, chiffre et caractere special."
                            rules={[
                                { required: true, message: "Le mot de passe est requis" },
                                {
                                    min: 8,
                                    message: "Le mot de passe doit contenir au moins 8 caracteres",
                                },
                                {
                                    pattern:
                                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
                                    message:
                                        "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractere special",
                                },
                            ]}
                        >
                            <Input.Password placeholder="********" />
                        </Form.Item>

                        <Form.Item
                            name="confirm_password"
                            label="Confirmer le mot de passe"
                            dependencies={["password"]}
                            rules={[
                                {
                                    required: true,
                                    message: "La confirmation du mot de passe est requise",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("Les mots de passe ne correspondent pas")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="********" />
                        </Form.Item>
                    </>
                )}
            </Form>
        </Modal>
    );
}
