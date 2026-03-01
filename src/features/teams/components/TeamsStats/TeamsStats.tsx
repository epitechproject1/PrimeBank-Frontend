import { Flex, Card, Avatar, Statistic, theme } from "antd";
import { TeamOutlined, BankOutlined, CalendarOutlined } from "@ant-design/icons";

const { useToken } = theme;

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
    const { token } = useToken();

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
                    style={{
                        flex: 1,
                        minWidth: 160,
                        background: token.colorBgContainer,
                        border: `1px solid ${stat.color}33`,
                        borderRadius: 12,
                        boxShadow: `0 2px 12px ${stat.color}18`,
                    }}
                    styles={{ body: { padding: "20px 24px" } }}
                >
                    <Flex align="center" gap={16}>
                        <Avatar
                            size={44}
                            icon={stat.icon}
                            style={{
                                backgroundColor: `${stat.color}1a`,
                                color: stat.color,
                            }}
                        />
                        <Statistic
                            title={
                                <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
                                    {stat.title}
                                </span>
                            }
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