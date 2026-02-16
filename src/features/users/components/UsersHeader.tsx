import { Flex, Typography, Button, Avatar, Grid } from "antd";
import { PlusOutlined, UserOutlined, SafetyOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface UsersHeaderProps {
    onAdd: () => void;
    onManagePermissions: () => void;
    screens: ReturnType<typeof Grid.useBreakpoint>;
    primaryColor: string;
    totalUsers: number;
}

export function UsersHeader({
    onAdd,
    onManagePermissions,
    screens,
    primaryColor,
    totalUsers,
}: UsersHeaderProps) {
    return (
        <Flex align="center" justify="space-between" style={{ marginBottom: 32 }}>
            <Flex align="center" gap={12}>
                <Avatar
                    size={48}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: primaryColor }}
                />
                <div>
                    <Title level={3} style={{ margin: 0 }}>
                        Gestion des utilisateurs
                    </Title>
                    <Text type="secondary">
                        {totalUsers} utilisateur{totalUsers > 1 ? "s" : ""}
                    </Text>
                </div>
            </Flex>

            <Flex gap={8}>
                <Button icon={<SafetyOutlined />} onClick={onManagePermissions}>
                    {screens.sm ? "Gerer droits" : ""}
                </Button>
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={onAdd}>
                    {screens.sm ? "Nouvel utilisateur" : ""}
                </Button>
            </Flex>
        </Flex>
    );
}
