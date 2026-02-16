import { Flex, Card, Avatar, Statistic } from "antd";
import {
    ApartmentOutlined,
    UserOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";

interface DepartmentsStatsProps {
    totalDepartments: number;
    activeCount: number;
    directorCount: number;
    colors?: {
        primary: string;
        success: string;
        warning: string;
    };
}

export function DepartmentsStats({
                                     totalDepartments,
                                     activeCount,
                                     directorCount,
                                     colors = {
                                         primary: "#1677ff",
                                         success: "#52c41a",
                                         warning: "#722ed1",
                                     },
                                 }: DepartmentsStatsProps) {
    const stats = [
        {
            title: "Total départements",
            value: totalDepartments,
            icon: <ApartmentOutlined />,
            color: colors.primary,
        },
        {
            title: "Actifs",
            value: activeCount || 0,
            icon: <CheckCircleOutlined />,
            color: colors.success,
        },
        {
            title: "Avec directeur",
            value: directorCount || 0,
            icon: <UserOutlined />,
            color: colors.warning,
        },
    ];

    return (
        <Flex gap={16} wrap="wrap" style={{ marginBottom: 32 }}>
            {stats.map((stat, i) => (
                <Card
                    key={i}
                    style={{ flex: 1, minWidth: 160 }}
                    styles={{ body: { padding: "20px 24px" } }}
                >
                    <Flex align="center" gap={16}>
                        <Avatar
                            size={44}
                            icon={stat.icon}
                            style={{
                                backgroundColor: `${stat.color}22`,
                                color: stat.color,
                            }}
                        />
                        <Statistic
                            title={stat.title}
                            value={stat.value}
                            valueStyle={{
                                fontSize: 26,
                                fontWeight: 800,
                                color: stat.color,
                            }}
                        />
                    </Flex>
                </Card>
            ))}
        </Flex>
    );
}
