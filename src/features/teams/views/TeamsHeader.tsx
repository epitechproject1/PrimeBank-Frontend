import { Flex, Typography, Button, Avatar, Grid, theme } from "antd";
import { PlusOutlined, TeamOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { useToken } = theme;

interface TeamsHeaderProps {
    onAdd?: () => void;
    screens: ReturnType<typeof Grid.useBreakpoint>;
    primaryColor: string;
}

export function TeamsHeader({ onAdd, screens }: TeamsHeaderProps) {
    const { token } = useToken();

    return (
        <Flex align="center" justify="space-between" style={{ marginBottom: 32 }}>
            <Flex align="center" gap={12}>
                <Avatar
                    size={48}
                    icon={<TeamOutlined />}
                    style={{ backgroundColor: token.colorPrimary }}
                />
                <div>
                    <Title level={3} style={{ margin: 0, color: token.colorText }}>
                        Gestion des équipes
                    </Title>
                    <Text type="secondary">Time Manager — PrimeBank</Text>
                </div>
            </Flex>

            {onAdd && (
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={onAdd}>
                    {screens.sm ? "Nouvelle équipe" : ""}
                </Button>
            )}
        </Flex>
    );
}