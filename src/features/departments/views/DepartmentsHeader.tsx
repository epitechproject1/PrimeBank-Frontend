import { Flex, Typography, Button, Avatar, Grid, theme } from "antd";
import { PlusOutlined, ApartmentOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { useToken } = theme;

export interface DepartmentsHeaderProps {
    onAdd: () => void;
    screens: ReturnType<typeof Grid.useBreakpoint>;
    canAdd: boolean;
}

export function DepartmentsHeader({ onAdd, screens, canAdd }: DepartmentsHeaderProps) {
    const { token } = useToken();

    return (
        <Flex align="center" justify="space-between" style={{ marginBottom: 32 }}>
            <Flex align="center" gap={12}>
                <Avatar
                    size={48}
                    icon={<ApartmentOutlined />}
                    style={{ backgroundColor: token.colorPrimary }}
                />
                <div>
                    <Title level={3} style={{ margin: 0, color: token.colorText }}>
                        Gestion des départements
                    </Title>
                    <Text type="secondary">Time Manager — PrimeBank</Text>
                </div>
            </Flex>

            {canAdd && (
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={onAdd}>
                    {screens.sm ? "Nouveau département" : ""}
                </Button>
            )}
        </Flex>
    );
}