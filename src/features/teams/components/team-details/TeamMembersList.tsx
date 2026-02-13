import { Avatar, Empty, List, Space, Tag, Typography } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import type { TeamMember, TeamType } from "../../types/teams.type";
import { AVATAR_COLORS, getInitials } from "../../utils/teams-constants";

const { Text } = Typography;

function getMemberLabel(m: TeamMember): string {
    const first = (m.first_name ?? "").trim();
    const last = (m.last_name ?? "").trim();
    const full = `${first} ${last}`.trim();
    return full || `Membre #${m.id}`;
}

function getAvatarText(label: string): string {
    const initials = getInitials(label);
    return initials?.trim() ? initials : "M";
}

export function TeamMembersList({
                                    team,
                                    members,
                                    colorIndex,
                                }: {
    team: TeamType;
    members: TeamMember[];
    colorIndex: number;
}) {
    if (!members || members.length === 0) {
        return (
            <Empty
                description="Aucun membre dans cette équipe  "
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: "40px 0", border: "1px solid #f0f0f0", borderRadius: 12 }}
            />
        );
    }

    return (
        <List
            dataSource={members}
            style={{ border: "1px solid #f0f0f0", borderRadius: 12, overflow: "hidden" }}
            renderItem={(member, index) => {
                const label = getMemberLabel(member);
                const avatarColor = AVATAR_COLORS[(colorIndex + index) % AVATAR_COLORS.length];

                return (
                    <List.Item style={{ padding: "12px 16px", background: index % 2 === 0 ? "#fafafa" : "#fff" }}>
                        <List.Item.Meta
                            avatar={
                                <Avatar style={{ backgroundColor: avatarColor }}>
                                    {getAvatarText(label)}
                                </Avatar>
                            }
                            title={
                                <Space>
                                    <Text strong>{label}</Text>
                                    {member.id === team.owner?.id ? (
                                        <Tag color="blue" style={{ fontSize: 11, padding: "0 6px", borderRadius: 4 }}>
                                            Responsable
                                        </Tag>
                                    ) : null}
                                </Space>
                            }
                            description={
                                <Space size={16}>
                                    {member.email ? (
                                        <Space size={6}>
                                            <MailOutlined style={{ fontSize: 12 }} />
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {member.email}
                                            </Text>
                                        </Space>
                                    ) : null}

                                    {"phone" in member && (member as { phone?: string }).phone ? (
                                        <Space size={6}>
                                            <PhoneOutlined style={{ fontSize: 12 }} />
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {(member as { phone?: string }).phone}
                                            </Text>
                                        </Space>
                                    ) : null}
                                </Space>
                            }
                        />
                    </List.Item>
                );
            }}
        />
    );
}
