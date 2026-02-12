import { Flex, Card, Avatar, Statistic } from "antd";
import { TeamOutlined, CalendarOutlined, SafetyOutlined } from "@ant-design/icons";
import type { User } from "../../users/types/user.type";

interface ProfileStatsProps {
    user: User;
    colors: {
        primary: string;
        success: string;
        warning: string;
    };
}

export function ProfileStats({ user, colors }: ProfileStatsProps) {
    const stats = [
        {
            title: "Role",
            value: user.role?.toUpperCase?.() || "--",
            icon: <TeamOutlined />,
            color: colors.primary,
        },
        {
            title: "Statut",
            value: user.is_active ? "Actif" : "Inactif",
            icon: <SafetyOutlined />,
            color: user.is_active ? colors.success : colors.warning,
        },
        {
            title: "Membre depuis",
            value: new Date(user.created_at).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
            icon: <CalendarOutlined />,
            color: colors.warning,
        },
    ];

    return (
        <Flex gap={16} wrap="wrap" style={{ marginBottom: 32 }}>
            {stats.map((stat, i) => (
                <Card
                    key={i}
                    style={{ flex: 1, minWidth: 200 }}
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
                                fontSize: 18,
                                fontWeight: 700,
                                color: stat.color,
                            }}
                        />
                    </Flex>
                </Card>
            ))}
        </Flex>
    );
}
