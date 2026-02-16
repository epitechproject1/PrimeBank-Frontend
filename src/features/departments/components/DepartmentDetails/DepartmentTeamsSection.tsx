import { Typography, Divider, Card, List, Flex, Avatar, Tag, Tooltip, Button } from "antd";
const { Text } = Typography;

import {
    TeamOutlined,
    EyeOutlined,
    UserOutlined,
    MailOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

type UserMini = {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
};

export type TeamLite = {
    id: number;
    name: string;
    description?: string | null;
    members_count?: number;
    membersCount?: number;
    owner?: UserMini | null;
};

function initials(text?: string) {
    const s = (text ?? "").trim();
    return s ? s.slice(0, 2).toUpperCase() : "DP";
}

function getOwnerName(owner?: UserMini | null) {
    if (!owner) return "—";
    const full = `${owner.first_name ?? ""} ${owner.last_name ?? ""}`.trim();
    return full || "—";
}

type Props = {
    teams: TeamLite[];
    loading?: boolean;
    onViewTeam?: (teamId: number) => void;
};

export function DepartmentTeamsSection({ teams, loading, onViewTeam }: Props) {
    return (
        <>
            <Divider style={{ margin: "18px 0" }} />

            <Title level={5} style={{ marginTop: 0 }}>
                Équipes associées ({teams.length})
            </Title>

            <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 0 } }}>
                <List
                    loading={loading}
                    dataSource={teams}
                    locale={{ emptyText: "Aucune équipe associée à ce département." }}
                    renderItem={(t) => {
                        const count = (t.members_count ?? t.membersCount ?? 0) as number;
                        const ownerName = getOwnerName(t.owner);

                        return (
                            <List.Item style={{ padding: 16 }}>
                                <Flex align="center" justify="space-between" style={{ width: "100%" }} gap={12}>
                                    <Flex align="center" gap={12} style={{ minWidth: 0 }}>
                                        <Avatar style={{ background: "#1677ff", fontWeight: 800 }}>
                                            {initials(t.name)}
                                        </Avatar>

                                        <div style={{ minWidth: 0 }}>
                                            <Flex align="center" gap={8} wrap="wrap">
                                                <Text strong ellipsis style={{ maxWidth: 360, display: "inline-block" }}>
                                                    {t.name}
                                                </Text>

                                                <Tag
                                                    color={t.owner ? "blue" : "default"}
                                                    style={{ borderRadius: 999, marginInlineEnd: 0 }}
                                                    icon={<UserOutlined />}
                                                >
                                                    Directeur : {ownerName}
                                                </Tag>
                                            </Flex>

                                            <div>
                                                <Text type="secondary">
                                                    <TeamOutlined style={{ marginRight: 6 }} />
                                                    {count} {count > 1 ? "membres" : "membre"}
                                                </Text>

                                                {t.owner?.email ? (
                                                    <>
                                                        <Text type="secondary" style={{ marginInline: 10 }}>
                                                            •
                                                        </Text>
                                                        <Text type="secondary">
                                                            <MailOutlined style={{ marginRight: 6 }} />
                                                            {t.owner.email}
                                                        </Text>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </Flex>

                                    {onViewTeam ? (
                                        <Tooltip title="Voir l'équipe">
                                            <Button icon={<EyeOutlined />} onClick={() => onViewTeam(t.id)} />
                                        </Tooltip>
                                    ) : null}
                                </Flex>
                            </List.Item>
                        );
                    }}
                />
            </Card>
        </>
    );
}
