import {
    Flex,
    Card,
    Avatar,
    Tag,
    Tooltip,
    Button,
    Popconfirm,
    Typography,
    Space,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    BankOutlined,
    EyeOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { TeamType } from "../types/teams.type.ts";
import {
    AVATAR_COLORS,
    TAG_COLORS,
    getInitials,
} from "../utils/teams-constants";

const { Text, Title } = Typography;

interface TeamsGridViewProps {
    teams: TeamType[];
    onEdit: (team: TeamType) => void;
    onDelete: (id: number) => void;
    onView: (team: TeamType, index: number) => void;
    screens: Partial<Record<string, boolean>>;
}

export function TeamsGridView({
                                  teams,
                                  onEdit,
                                  onDelete,
                                  onView,
                                  screens,
                              }: TeamsGridViewProps) {
    const getCardWidth = () => {
        if (screens.xxl) return "calc(33.333% - 16px)";
        if (screens.xl) return "calc(50% - 12px)";
        if (screens.md) return "calc(50% - 12px)";
        return "100%";
    };

    return (
        <Flex gap={24} wrap="wrap">
            {teams.map((team, i) => {
                const leaderName = team.owner
                    ? `${team.owner.first_name} ${team.owner.last_name}`
                    : "Aucun responsable";

                const membersCount =
                    (team as any).members_count ??
                    (Array.isArray((team as any).members) ? (team as any).members.length : 0);

                const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];

                return (
                    <Card
                        key={team.id}
                        style={{
                            width: getCardWidth(),
                            borderRadius: 16,
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
                            border: "1px solid #f0f0f0",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            cursor: "pointer",
                        }}
                        styles={{ body: { padding: 0 } }}
                        hoverable
                        onClick={() => onView(team, i)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 8px 24px 0 rgba(0, 0, 0, 0.12)";
                            e.currentTarget.style.transform = "translateY(-4px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <div
                            style={{
                                background: `linear-gradient(135deg, ${avatarColor}20 0%, ${avatarColor}08 100%)`,
                                padding: "24px",
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: 16,
                                    right: 16,
                                    display: "flex",
                                    gap: 6,
                                    opacity: 0.7,
                                    transition: "opacity 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = "1";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = "0.7";
                                }}
                            >
                                <Tooltip title="Voir les détails">
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<EyeOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onView(team, i);
                                        }}
                                        style={{
                                            background: "white",
                                            borderRadius: 8,
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                        }}
                                    />
                                </Tooltip>
                                <Tooltip title="Modifier">
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(team);
                                        }}
                                        style={{
                                            background: "white",
                                            borderRadius: 8,
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                        }}
                                    />
                                </Tooltip>
                                <Popconfirm
                                    title="Supprimer cette équipe ?"
                                    description="Cette action est irréversible."
                                    okText="Supprimer"
                                    cancelText="Annuler"
                                    okButtonProps={{ danger: true }}
                                    onConfirm={(e) => {
                                        e?.stopPropagation();
                                        onDelete(team.id!);
                                    }}
                                    onCancel={(e) => e?.stopPropagation()}
                                >
                                    <Tooltip title="Supprimer">
                                        <Button
                                            type="text"
                                            size="small"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                background: "white",
                                                borderRadius: 8,
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                            }}
                                        />
                                    </Tooltip>
                                </Popconfirm>
                            </div>

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
                                            color={TAG_COLORS[i % TAG_COLORS.length]}
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

                        <div style={{ padding: "20px 24px 24px" }}>
                            {team.description ? (
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 13,
                                        lineHeight: 1.6,
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        marginBottom: 20,
                                        minHeight: 42,
                                    }}
                                >
                                    {team.description}
                                </Text>
                            ) : (
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 13,
                                        fontStyle: "italic",
                                        display: "block",
                                        marginBottom: 20,
                                        minHeight: 42,
                                    }}
                                >
                                    Aucune description
                                </Text>
                            )}

                            <Flex gap={16} justify="space-between">
                                <Space size={8} style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 10,
                                            background: "#f0f5ff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <UserOutlined style={{ color: "#1890ff", fontSize: 16 }} />
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 11, display: "block", lineHeight: 1.2 }}
                                        >
                                            Responsable
                                        </Text>
                                        <Text
                                            strong
                                            style={{
                                                fontSize: 13,
                                                display: "block",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {leaderName}
                                        </Text>
                                    </div>
                                </Space>

                                <Space size={8} style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 10,
                                            background: "#f6ffed",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <TeamOutlined style={{ color: "#52c41a", fontSize: 16 }} />
                                    </div>
                                    <div>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 11, display: "block", lineHeight: 1.2 }}
                                        >
                                            Membres
                                        </Text>
                                        <Text strong style={{ fontSize: 13, display: "block" }}>
                                            {membersCount}
                                        </Text>
                                    </div>
                                </Space>
                            </Flex>

                            <Button
                                type="link"
                                block
                                icon={<EyeOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onView(team, i);
                                }}
                                style={{
                                    marginTop: 16,
                                    height: 36,
                                    fontWeight: 500,
                                    borderRadius: 8,
                                }}
                            >
                                Voir les détails
                            </Button>
                        </div>
                    </Card>
                );
            })}
        </Flex>
    );
}