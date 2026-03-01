import { Avatar, List, Space, Tag, Typography, theme } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import type { TeamMember, TeamType } from "../../types/teams.type";
import { AVATAR_COLORS, getInitials } from "../../utils/teams-constants";

const { Text } = Typography;
const { useToken } = theme;

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

type Props = {
    member: TeamMember;
    index: number;
    team: TeamType;
    colorIndex: number;
};

export function TeamMemberRow({ member, index, team, colorIndex }: Props) {
    const { token } = useToken();
    const label = getMemberLabel(member);
    const avatarColor = AVATAR_COLORS[(colorIndex + index) % AVATAR_COLORS.length];
    const phone = "phone" in member ? (member as { phone?: string }).phone : undefined;

    const rowBg = index % 2 === 0 ? token.colorFillQuaternary : token.colorBgContainer;

    return (
        <List.Item style={{ padding: "12px 16px", background: rowBg }}>
            <List.Item.Meta
                avatar={
                    <Avatar style={{ backgroundColor: avatarColor }}>
                        {getAvatarText(label)}
                    </Avatar>
                }
                title={
                    <Space>
                        <Text strong>{label}</Text>
                        {member.id === team.owner?.id && (
                            <Tag
                                color="blue"
                                style={{ fontSize: 11, padding: "0 6px", borderRadius: 4 }}
                            >
                                Responsable
                            </Tag>
                        )}
                    </Space>
                }
                description={
                    <Space size={16}>
                        {member.email && (
                            <Space size={6}>
                                <MailOutlined style={{ fontSize: 12 }} />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {member.email}
                                </Text>
                            </Space>
                        )}
                        {phone && (
                            <Space size={6}>
                                <PhoneOutlined style={{ fontSize: 12 }} />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {phone}
                                </Text>
                            </Space>
                        )}
                    </Space>
                }
            />
        </List.Item>
    );
}