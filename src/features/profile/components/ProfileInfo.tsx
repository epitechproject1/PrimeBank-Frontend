// src/features/users/profile/components/ProfileInfo.tsx

import { Card, Descriptions, Tag, Avatar, Space, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { User } from "features/users";

const { Title } = Typography;

type Props = {
    profile: User;
};

export default function ProfileInfo({ profile }: Readonly<Props>) {
    const roleColor = {
        admin: "red",
        manager: "blue",
        user: "green",
    };

    return (
        <Card>
            <Space align="center" style={{ marginBottom: 24 }}>
                <Avatar
                    size={64}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: roleColor[profile.role] }}
                />
                <div>
                    <Title level={3} style={{ margin: 0 }}>
                        {profile.first_name} {profile.last_name}
                    </Title>
                    <Tag color={roleColor[profile.role]} style={{ marginTop: 8 }}>
                        {profile.role.toUpperCase()}
                    </Tag>
                </div>
            </Space>

            <Descriptions bordered column={1} labelStyle={{ fontWeight: 500 }}>
                <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
                <Descriptions.Item label="Téléphone">
                    {profile.phone_number || "Non renseigné"}
                </Descriptions.Item>
                <Descriptions.Item label="Statut">
                    <Tag color={profile.is_active ? "success" : "error"}>
                        {profile.is_active ? "Actif" : "Inactif"}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Membre depuis">
                    {new Date(profile.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
}