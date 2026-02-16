import { Avatar, Button, Flex, Tag, Typography } from "antd";
import { BankOutlined, EditOutlined, TeamOutlined } from "@ant-design/icons";
import type { TeamType } from "../../types/teams.type";
import { AVATAR_COLORS, TAG_COLORS, getInitials } from "../../utils/teams-constants";

const { Title, Paragraph } = Typography;

type Props = {
    team: TeamType;
    colorIndex: number;
    onEditClick: () => void;
};

export function TeamDetailsHeader({ team, colorIndex, onEditClick }: Props) {
    const avatarColor = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
    const tagColor = TAG_COLORS[colorIndex % TAG_COLORS.length];

    return (
        <div
            style={{
                background: `linear-gradient(135deg, ${avatarColor}25 0%, ${avatarColor}10 100%)`,
                padding: "32px 32px 24px",
                borderBottom: "1px solid #f0f0f0",
            }}
        >
            <Flex gap={20} align="flex-start">
                <Avatar
                    size={80}
                    style={{
                        backgroundColor: avatarColor,
                        fontWeight: 600,
                        fontSize: 32,
                        flexShrink: 0,
                        boxShadow: `0 8px 24px ${avatarColor}50`,
                        border: "4px solid white",
                    }}
                >
                    {getInitials(team.name)}
                </Avatar>

                <Flex vertical style={{ flex: 1, minWidth: 0 }}>
                    <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
                        {team.name}
                    </Title>

                    <Flex gap={8} wrap="wrap" align="center">
                        {team.department && (
                            <Tag
                                color={tagColor}
                                icon={<BankOutlined />}
                                style={{
                                    borderRadius: 8,
                                    padding: "4px 12px",
                                    fontSize: 13,
                                    fontWeight: 500,
                                }}
                            >
                                {team.department.name ?? `Département #${team.department.id}`}
                            </Tag>
                        )}

                        <Tag
                            icon={<TeamOutlined />}
                            style={{ borderRadius: 8, padding: "4px 12px", fontSize: 13 }}
                        >
                            {team.members_count} {team.members_count <= 1 ? "Membre" : "Membres"}
                        </Tag>
                    </Flex>

                    {team.description && (
                        <Paragraph
                            type="secondary"
                            style={{ marginTop: 12, marginBottom: 0, fontSize: 14, lineHeight: 1.6 }}
                        >
                            {team.description}
                        </Paragraph>
                    )}
                </Flex>

                <Button type="primary" icon={<EditOutlined />} onClick={onEditClick} style={{ borderRadius: 8 }}>
                    Modifier
                </Button>
            </Flex>
        </div>
    );
}
