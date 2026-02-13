import { Flex, Typography, Button, Avatar, Grid, Tag } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import type { User } from "../../users/types/user.type";

const { Title, Text } = Typography;

interface ProfileHeaderProps {
    user: User;
    screens: ReturnType<typeof Grid.useBreakpoint>;
    primaryColor: string;
    onEditInfo: () => void;
}

export function ProfileHeader({
    user,
    screens,
    primaryColor,
    onEditInfo,
}: ProfileHeaderProps) {
    const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`
        .toUpperCase()
        .slice(0, 2);

    return (
        <Flex align="center" justify="space-between" style={{ marginBottom: 32 }}>
            <Flex align="center" gap={12}>
                <Avatar size={52} style={{ backgroundColor: primaryColor, fontWeight: 700 }}>
                    {initials || <UserOutlined />}
                </Avatar>
                <div>
                    <Title level={3} style={{ margin: 0 }}>
                        {user.first_name} {user.last_name}
                    </Title>
                    <Flex gap={8} align="center" wrap="wrap">
                        <Text type="secondary">{user.email}</Text>
                        <Tag color={user.is_active ? "success" : "error"}>
                            {user.is_active ? "Actif" : "Inactif"}
                        </Tag>
                    </Flex>
                </div>
            </Flex>

            <Button icon={<EditOutlined />} onClick={onEditInfo}>
                {screens.sm ? "Modifier profil" : ""}
            </Button>
        </Flex>
    );
}
