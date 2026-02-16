import { Flex, Typography, Button, Avatar, Grid } from "antd";
import { PlusOutlined, TeamOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface TeamsHeaderProps {
    onAdd: () => void;
    screens: ReturnType<typeof Grid.useBreakpoint>;
    primaryColor: string;
}

export function TeamsHeader({ onAdd, screens, primaryColor }: TeamsHeaderProps) {
    return (
        <Flex align="center" justify="space-between" style={{ marginBottom: 32 }}>
            <Flex align="center" gap={12}>
                <Avatar
                    size={48}
                    icon={<TeamOutlined />}
                    style={{ backgroundColor: primaryColor }}
                />
                <div>
                    <Title level={3} style={{ margin: 0 }}>
                        Gestion des équipes
                    </Title>
                    <Text type="secondary">Time Manager — PrimeBank</Text>
                </div>
            </Flex>

            <Button type="primary" icon={<PlusOutlined />} size="large" onClick={onAdd}>
                {screens.sm ? "Nouvelle équipe" : ""}
            </Button>
        </Flex>
    );
}