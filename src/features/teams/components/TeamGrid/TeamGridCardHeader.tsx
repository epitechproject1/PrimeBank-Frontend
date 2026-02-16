import { Avatar, Flex, Tag, Typography } from "antd";
import { BankOutlined } from "@ant-design/icons";
import type { TeamType } from "../../types/teams.type";
import { getInitials, AVATAR_COLORS, TAG_COLORS } from "../../utils/teams-constants";
import { TeamGridCardActions } from "./TeamGridCardActions";

const { Title } = Typography;

type Props = {
    team: TeamType;
    index: number;
    onEdit: (team: TeamType) => void;
    onDelete: (id: number) => void;
    onView: (team: TeamType, index: number) => void;
};

export function TeamGridCardHeader({ team, index, onEdit, onDelete, onView }: Props) {
    const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

    return (
        <div
            style={{
                background: `linear-gradient(135deg, ${avatarColor}20 0%, ${avatarColor}08 100%)`,
                padding: "24px",
                position: "relative",
            }}
        >
            <TeamGridCardActions team={team} index={index} onEdit={onEdit} onDelete={onDelete} onView={onView} />

            <Flex gap={16} align="flex-start">
                <Avatar
                    size={64}
                    style={{
                        backgroundColor: avatarColor,
                        fontWeight: 600,
                        fontSize: 24,
                        flexShrink: 0,
                        boxShadow: `0 8px 16px ${avatarColor}40`,
                        border: "3px solid white",
                    }}
                >
                    {getInitials(team.name)}
                </Avatar>

                <Flex vertical style={{ minWidth: 0, flex: 1, paddingTop: 4 }}>
                    <Title
                        level={4}
                        style={{
                            margin: 0,
                            fontSize: 20,
                            fontWeight: 600,
                            lineHeight: 1.3,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {team.name}
                    </Title>

                    {team.department && (
                        <Tag
                            color={TAG_COLORS[index % TAG_COLORS.length]}
                            icon={<BankOutlined />}
                            style={{
                                borderRadius: 6,
                                marginTop: 10,
                                border: "none",
                                fontWeight: 500,
                                fontSize: 12,
                                width: "fit-content",
                            }}
                        >
                            {team.department.name ?? `Dept #${team.department.id}`}
                        </Tag>
                    )}
                </Flex>
            </Flex>
        </div>
    );
}
