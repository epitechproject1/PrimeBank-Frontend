import {Flex, Card, Avatar, Tag, Tooltip, Button, Popconfirm, Typography} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    BankOutlined,
    UserOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import { TeamType } from "../types/teams.type.ts";
import { AVATAR_COLORS, TAG_COLORS, formatDate, getInitials } from "../utils/teams-constants";
const {Text} = Typography;
interface TeamsGridViewProps {
    teams: TeamType[];
    onEdit: (team: TeamType) => void;
    onDelete: (id: number) => void;
    screens: Partial<Record<string, boolean>>;
}

export function TeamsGridView({ teams, onEdit, onDelete, screens }: TeamsGridViewProps) {
    const getCardWidth = () => {
        if (screens.xl) return "calc(33% - 14px)";
        if (screens.md) return "calc(50% - 10px)";
        return "100%";
    };

    return (
        <Flex gap={20} wrap="wrap">
            {teams.map((team, i) => (
                <Card
                    key={team.id}
                    hoverable
                    style={{ width: getCardWidth() }}
                    styles={{ body: { padding: 20 } }}
                    actions={[
                        <Tooltip title="Modifier" key="edit">
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => onEdit(team)}
                            />
                        </Tooltip>,
                        <Popconfirm
                            key="delete"
                            title="Supprimer cette équipe ?"
                            description="Cette action est irréversible."
                            okText="Supprimer"
                            cancelText="Annuler"
                            okButtonProps={{ danger: true }}
                            onConfirm={() => onDelete(team.id!)}
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>,
                    ]}
                >
                    <Flex gap={12} align="flex-start">
                        <Avatar
                            size={48}
                            style={{
                                backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                                fontWeight: 700,
                                flexShrink: 0,
                            }}
                        >
                            {getInitials(team.name)}
                        </Avatar>
                        <Flex vertical style={{ minWidth: 0 }}>
                            <Text strong style={{ fontSize: 15 }}>
                                {team.name}
                            </Text>
                            <Text
                                type="secondary"
                                style={{
                                    fontSize: 13,
                                    overflow: "hidden",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                {team.description || "Pas de description"}
                            </Text>
                            <Flex gap={8} style={{ marginTop: 10 }} wrap="wrap" align="center">
                                {team.department && (
                                    <Tag
                                        color={TAG_COLORS[i % TAG_COLORS.length]}
                                        icon={<BankOutlined />}
                                    >
                                        {team.department.name ?? `Dept #${team.department.id}`}
                                    </Tag>
                                )}
                                {team.owner && (
                                    <Tag icon={<UserOutlined />}>
                                        {team.owner.first_name} {team.owner.last_name}
                                    </Tag>
                                )}
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    <CalendarOutlined /> {formatDate(team.created_at)}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Card>
            ))}
        </Flex>
    );
}