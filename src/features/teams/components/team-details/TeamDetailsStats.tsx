import { Card, Col, Row, Space, Typography } from "antd";
import { MailOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import type {TeamMember, TeamType} from "../../types/teams.type";

const { Text } = Typography;

type Props = {
    team: TeamType;
    members: TeamMember[];
    leaderName: string;
};

export function TeamDetailsStats({ team, members, leaderName }: Props) {
    const activeMembers = members.filter((m) => m.is_active !== false).length;

    return (
        <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12}>
                <Card
                    size="small"
                    style={{
                        borderRadius: 12,
                        background: "#f0f5ff",
                        border: "1px solid #d6e4ff",
                    }}
                >
                    <Space direction="vertical" size={4} style={{ width: "100%" }}>
                        <Space>
                            <UserOutlined style={{ color: "#1890ff", fontSize: 18 }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Responsable de l'équipe
                            </Text>
                        </Space>

                        <Text strong style={{ fontSize: 16 }}>
                            {leaderName}
                        </Text>

                        {team.owner?.email && (
                            <Space size={4}>
                                <MailOutlined style={{ fontSize: 12, color: "#8c8c8c" }} />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {team.owner.email}
                                </Text>
                            </Space>
                        )}
                    </Space>
                </Card>
            </Col>

            <Col xs={24} sm={12}>
                <Card
                    size="small"
                    style={{
                        borderRadius: 12,
                        background: "#f6ffed",
                        border: "1px solid #b7eb8f",
                    }}
                >
                    <Space direction="vertical" size={4} style={{ width: "100%" }}>
                        <Space>
                            <TeamOutlined style={{ color: "#52c41a", fontSize: 18 }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Total des membres
                            </Text>
                        </Space>

                        <Text strong style={{ fontSize: 16 }}>
                            {team.members_count} {team.members_count <= 1 ? "Membre" : "Membres"}
                        </Text>

                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {activeMembers} actifs
                        </Text>
                    </Space>
                </Card>
            </Col>
        </Row>
    );
}
