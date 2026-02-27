import { Avatar, Button, Flex, Tag, Typography } from "antd";
import {
    EditOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    StopOutlined,
    UserOutlined,
} from "@ant-design/icons";
import type { DepartmentType } from "../../types/departments.type";

const { Title, Paragraph } = Typography;

/** ✅ mêmes idées que Teams, mais local au fichier */
const AVATAR_COLORS = [
    "#1677ff",
    "#13c2c2",
    "#52c41a",
    "#faad14",
    "#eb2f96",
    "#722ed1",
    "#fa541c",
    "#2f54eb",
];

const TAG_COLORS = [
    "blue",
    "cyan",
    "green",
    "gold",
    "magenta",
    "purple",
    "volcano",
    "geekblue",
] as const;

function getInitials(text?: string) {
    const s = (text ?? "").trim();
    return s ? s.slice(0, 2).toUpperCase() : "DP";
}

type Props = {
    department: DepartmentType;
    teamsCount: number;

    /** ✅ option 1 : tu passes colorIndex depuis le parent */
    colorIndex?: number;

    /** ✅ option 2 : ou tu laisses auto basé sur id (si colorIndex non fourni) */
    onEditClick?: () => void;
    canEdit?: boolean;
};

export function DepartmentDetailsHeader({
                                            department,
                                            teamsCount,
                                            colorIndex,
                                            onEditClick,
                                            canEdit = false,
                                        }: Props) {
    const safeIndex = (colorIndex ?? department.id ?? 0) % AVATAR_COLORS.length;

    const avatarColor = AVATAR_COLORS[safeIndex];
    const tagColor = TAG_COLORS[safeIndex % TAG_COLORS.length];

    const name = department.name ?? "Département";
    const isActive = Boolean(department.is_active);

    const directorLabel = department.director
        ? `${department.director.first_name ?? ""} ${department.director.last_name ?? ""}`.trim() || "—"
        : "—";

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
                    {getInitials(name)}
                </Avatar>

                <Flex vertical style={{ flex: 1, minWidth: 0 }}>
                    <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
                        {name}
                    </Title>

                    <Flex gap={8} wrap="wrap" align="center">
                        <Tag
                            color={isActive ? "success" : "default"}
                            icon={isActive ? <CheckCircleOutlined /> : <StopOutlined />}
                            style={{
                                borderRadius: 8,
                                padding: "4px 12px",
                                fontSize: 13,
                                fontWeight: 500,
                            }}
                        >
                            {isActive ? "Actif" : "Inactif"}
                        </Tag>

                        <Tag
                            color={tagColor}
                            icon={<UserOutlined />}
                            style={{
                                borderRadius: 8,
                                padding: "4px 12px",
                                fontSize: 13,
                                fontWeight: 500,
                            }}
                        >
                            {directorLabel}
                        </Tag>

                        <Tag icon={<TeamOutlined />} style={{ borderRadius: 8, padding: "4px 12px", fontSize: 13 }}>
                            {teamsCount} {teamsCount === 1 ? "Équipe" : "Équipes"}
                        </Tag>
                    </Flex>

                    {department.description && (
                        <Paragraph
                            type="secondary"
                            style={{ marginTop: 12, marginBottom: 0, fontSize: 14, lineHeight: 1.6 }}
                        >
                            {department.description}
                        </Paragraph>
                    )}
                </Flex>

                {canEdit && onEditClick && (
                    <Button type="primary" icon={<EditOutlined />} onClick={onEditClick} style={{ borderRadius: 8 }}>
                        Modifier
                    </Button>
                )}
            </Flex>
        </div>
    );
}