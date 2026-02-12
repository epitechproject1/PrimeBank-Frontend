import { Flex, Card, Avatar, Statistic } from "antd";
import { TeamOutlined, BankOutlined, CalendarOutlined } from "@ant-design/icons";

interface TeamsStatsProps {
    totalTeams: number;
    departmentCount: number;
    thisMonthCount: number;
    colors: {
        primary: string;
        success: string;
        warning: string;
    };
}

export function TeamsStats({
                               totalTeams,
                               departmentCount,
                               thisMonthCount,
                               colors,
                           }: TeamsStatsProps) {
    const stats = [
        {
            title: "Total équipes",
            value: totalTeams,
            icon: <TeamOutlined />,
            color: colors.primary,
        },
        {
            title: "Départements",
            value: departmentCount || 0,
            icon: <BankOutlined />,
            color: colors.success,
        },
        {
            title: "Ce mois",
            value: thisMonthCount,
            icon: <CalendarOutlined />,
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