import { Card, Descriptions, Tag, Avatar, Flex, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { User } from "../../users/types/user.type";

const { Text } = Typography;

interface ProfileInfoCardProps {
    user?: User;
}

export const ProfileInfoCard = ({ user }: ProfileInfoCardProps) => {
    if (!user) return null;

    const roleColor: Record<string, string> = {
        admin: "red",
        manager: "blue",
        user: "green",
    };

    const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`
        .toUpperCase()
        .slice(0, 2);

    return (
        <Card title="Profil" style={{ marginBottom: 16 }}>
            <Flex align="center" gap={12} style={{ marginBottom: 16 }}>
                <Avatar size={48} icon={<UserOutlined />}>
                    {initials}
                </Avatar>
                <div>
                    <Text strong>
                        {user.first_name} {user.last_name}
                    </Text>
                    <div>
                        <Tag color={roleColor[user.role] || "default"}>
                            {user.role?.toUpperCase?.()}
                        </Tag>
                    </div>
                </div>
            </Flex>

            <Descriptions column={1} size="small">
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Telephone">
                    {user.phone_number || "--"}
                </Descriptions.Item>
                <Descriptions.Item label="Statut">
                    <Tag color={user.is_active ? "success" : "error"}>
                        {user.is_active ? "Actif" : "Inactif"}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};
