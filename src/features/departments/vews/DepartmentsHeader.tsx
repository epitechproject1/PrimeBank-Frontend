import { Flex, Typography, Button, Avatar, Grid } from "antd";
import { PlusOutlined, ApartmentOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface DepartmentsHeaderProps {
    onAdd: () => void;
    screens: ReturnType<typeof Grid.useBreakpoint>;
    primaryColor: string;
}

export function DepartmentsHeader({
                                      onAdd,
                                      screens,
                                      primaryColor,
                                  }: DepartmentsHeaderProps) {
    return (
        <Flex align="center" justify="space-between" style={{ marginBottom: 32 }}>
            <Flex align="center" gap={12}>
                <Avatar
                    size={48}
                    icon={<ApartmentOutlined />}
                    style={{ backgroundColor: primaryColor }}
                />
                <div>
                    <Title level={3} style={{ margin: 0 }}>
                        Gestion des départements
                    </Title>
                    <Text type="secondary">Time Manager — PrimeBank</Text>
                </div>
            </Flex>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={onAdd}
            >
                {screens.sm ? "Nouveau département" : ""}
            </Button>
        </Flex>
    );
}
