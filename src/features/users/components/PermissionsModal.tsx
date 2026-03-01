import { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Modal, Select, DatePicker, Space, message } from "antd";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { searchUsers } from "../../../services/usersApi";
import type { User } from "../types/user.type";

export type PermissionPayload = {
    type_permission: string;
    date_debut?: string;
    date_de_fin?: string;
    id_receveur?: string;
};

interface PermissionsModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: PermissionPayload) => void;
}

export function PermissionsModal({ open, onClose, onSubmit }: PermissionsModalProps) {
    const [form] = Form.useForm();
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const debouncedQuery = useDebouncedValue(query, 350);

    useEffect(() => {
        let active = true;
        const run = async () => {
            setLoading(true);
            try {
                const result = await searchUsers({ q: debouncedQuery || undefined });
                if (active) setUsers(result.data || []);
            } catch {
                if (active) messageApi.error("Erreur lors de la recherche utilisateurs");
            } finally {
                if (active) setLoading(false);
            }
        };
        if (open) {
            void run();
        }
        return () => {
            active = false;
        };
    }, [debouncedQuery, messageApi, open]);

    const userOptions = useMemo(
        () =>
            users.map((u) => ({
                value: u.id,
                label: `${u.first_name} ${u.last_name} (${u.email})`,
            })),
        [users]
    );

    const handleFinish = (values: PermissionPayload) => {
        onSubmit(values);
        form.resetFields();
    };

    return (
        <Modal
            title="Gerer les droits et acces"
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            {contextHolder}
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    name="id_receveur"
                    label="Utilisateur (receveur)"
                    rules={[{ required: true, message: "Selectionnez un utilisateur" }]}
                >
                    <Select
                        showSearch
                        placeholder="Rechercher un utilisateur"
                        options={userOptions}
                        loading={loading}
                        onSearch={(value) => setQuery(value)}
                        filterOption={false}
                        notFoundContent={loading ? "Chargement..." : "Aucun utilisateur"}
                    />
                </Form.Item>

                <Form.Item
                    name="type_permission"
                    label="Type de permission"
                    rules={[{ required: true, message: "Le types est requis" }]}
                >
                    <Input placeholder="ex: ACCES_COMPTES" />
                </Form.Item>

                <Space size={12} style={{ display: "flex" }}>
                    <Form.Item name="date_debut" label="Date debut" style={{ flex: 1 }}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="date_de_fin" label="Date de fin" style={{ flex: 1 }}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Space>

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
