import { Card, Space, Typography } from "antd";
import { MailOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import type { TeamMember, TeamType } from "../../types/teams.type";

const { Text } = Typography;

type WithIsActive = { is_active?: boolean };

function getActiveCount(members: TeamMember[]) {
    return members.reduce((acc, m) => {
        const active = (m as WithIsActive).is_active;
        return acc + (active === false ? 0 : 1);
    }, 0);
}

export function TeamDetailsStats({
                                     team,
                                     members,
                                     leaderName,
                                 }: {
    team: TeamType;
    members: TeamMember[];
    leaderName: string;
}) {
    const membersCount = team.members_count ?? members.length;
    const activeCount = getActiveCount(members);

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <Card
                size="small"
                style={{ borderRadius: 12, background: "#f0f5ff", border: "1px solid #d6e4ff" }}
            >
                <Space direction="vertical" size={4} style={{ width: "100%" }}>
                    <Space>
                        <UserOutlined style={{ fontSize: 18 }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Responsable de l'équipe
                        </Text>
                    </Space>

                    <Text strong style={{ fontSize: 16 }}>
                        {leaderName}
                    </Text>

                    {team.owner?.email ? (
                        <Space size={6}>
                            <MailOutlined style={{ fontSize: 12 }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {team.owner.email}
                            </Text>
                        </Space>
                    ) : null}
                </Space>
            </Card>

            <Card
                size="small"
                style={{ borderRadius: 12, background: "#f6ffed", border: "1px solid #b7eb8f" }}
            >
                <Space direction="vertical" size={4} style={{ width: "100%" }}>
                    <Space>
                        <TeamOutlined style={{ fontSize: 18 }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Total des membres
                        </Text>
                    </Space>

                    <Text strong style={{ fontSize: 16 }}>
                        {membersCount} {membersCount <= 1 ? "Membre" : "Membres"}
                    </Text>

                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {activeCount} actif{activeCount <= 1 ? "" : "s"}
                    </Text>
                </Space>
            </Card>
        </div>
    );
}
