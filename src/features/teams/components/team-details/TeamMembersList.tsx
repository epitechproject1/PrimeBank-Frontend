import { Avatar, Empty, List, Space, Tag, Typography } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import type {TeamMember, TeamType} from "../../types/teams.type";
import { AVATAR_COLORS, getInitials } from "../../utils/teams-constants";

const { Text } = Typography;

type Props = {
    team: TeamType;
    members: TeamMember[];
    colorIndex: number;
};

function getMemberDisplayName(member: TeamMember): string {
    const first = member.first_name ?? "";
    const last = member.last_name ?? "";
    const full = `${first} ${last}`.trim();
    if (full) return full;
    if (member.name) return member.name;
    return `Membre #${member.id}`;
}

function getMemberInitials(member: TeamMember): string {
    const name = getMemberDisplayName(member);
    return getInitials(name);
}

export function TeamMembersList({ team, members, colorIndex }: Props) {
    const count = team.members_count;

    if (members.length === 0) {
        return (
            <Empty
                description="Aucun membre dans cette équipe"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: "40px 0", border: "1px solid #f0f0f0", borderRadius: 12 }}
            />
        );
    }

    return (
        <List
            dataSource={members}
            style={{ border: "1px solid #f0f0f0", borderRadius: 12, overflow: "hidden" }}
            renderItem={(member, index) => (
                <List.Item
                    style={{
                        padding: "12px 16px",
                        background: index % 2 === 0 ? "#fafafa" : "white",
                    }}
                >
                    <List.Item.Meta
                        avatar={
                            <Avatar
                                style={{
                                    backgroundColor: AVATAR_COLORS[(colorIndex + index) % AVATAR_COLORS.length],
                                }}
                            >
                                {getMemberInitials(member)}
                            </Avatar>
                        }
                        title={
                            <Space>
                                <Text strong>{getMemberDisplayName(member)}</Text>

                                {member.id === team.owner?.id && (
                                    <Tag color="blue" style={{ fontSize: 11, padding: "0 6px", borderRadius: 4 }}>
                                        Responsable
                                    </Tag>
                                )}
                            </Space>
                        }
                        description={
                            <Space size={16}>
                                {member.email && (
                                    <Space size={4}>
                                        <MailOutlined style={{ fontSize: 12 }} />
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {member.email}
                                        </Text>
                                    </Space>
                                )}
                                {"phone" in member && member.phone && (
                                    <Space size={4}>
                                        <PhoneOutlined style={{ fontSize: 12 }} />
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {member.phone}
                                        </Text>
                                    </Space>
                                )}
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {count <= 1 ? "Équipe petite" : "Équipe"}
                                </Text>
                            </Space>
                        }
                    />
                </List.Item>
            )}
        />
    );
}
