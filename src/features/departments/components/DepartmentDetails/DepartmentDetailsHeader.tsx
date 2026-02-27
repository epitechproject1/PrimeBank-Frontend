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

function getSafeIndex(colorIndex: number | undefined, departmentId: number | undefined) {
    return (colorIndex ?? departmentId ?? 0) % AVATAR_COLORS.length;
}

function getDirectorLabel(dept: DepartmentType) {
    const d = dept.director;
    if (!d) return "—";

    const fullName = `${d.first_name ?? ""} ${d.last_name ?? ""}`.trim();
    return fullName || "—";
}

function TeamsCountTag({ teamsCount }: { teamsCount: number }) {
    const label = teamsCount === 1 ? "Équipe" : "Équipes";
    return (
        <Tag icon={<TeamOutlined />} style={{ borderRadius: 8, padding: "4px 12px", fontSize: 13 }}>
            {teamsCount} {label}
        </Tag>
    );
}

function StatusTag({ isActive }: { isActive: boolean }) {
    const color = isActive ? "success" : "default";
    const icon = isActive ? <CheckCircleOutlined /> : <StopOutlined />;
    const label = isActive ? "Actif" : "Inactif";

    return (
        <Tag
            color={color}
            icon={icon}
            style={{
                borderRadius: 8,
                padding: "4px 12px",
                fontSize: 13,
                fontWeight: 500,
            }}
        >
            {label}
        </Tag>
    );
}

function DirectorTag({ tagColor, directorLabel }: { tagColor: (typeof TAG_COLORS)[number]; directorLabel: string }) {
    return (
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
    );
}

function DescriptionBlock({ description }: { description?: string | null }) {
    if (!description) return null;

    return (
        <Paragraph type="secondary" style={{ marginTop: 12, marginBottom: 0, fontSize: 14, lineHeight: 1.6 }}>
            {description}
        </Paragraph>
    );
}

function EditButton({ canEdit, onEditClick }: { canEdit: boolean; onEditClick?: () => void }) {
    if (!canEdit || !onEditClick) return null;

    return (
        <Button type="primary" icon={<EditOutlined />} onClick={onEditClick} style={{ borderRadius: 8 }}>
            Modifier
        </Button>
    );
}

type Props = {
    department: DepartmentType;
    teamsCount: number;
    colorIndex?: number;
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
    const safeIndex = getSafeIndex(colorIndex, department.id);

    const avatarColor = AVATAR_COLORS[safeIndex];
    const tagColor = TAG_COLORS[safeIndex % TAG_COLORS.length];

    const name = department.name || "Département";
    const isActive = Boolean(department.is_active);
    const directorLabel = getDirectorLabel(department);

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
                        <StatusTag isActive={isActive} />
                        <DirectorTag tagColor={tagColor} directorLabel={directorLabel} />
                        <TeamsCountTag teamsCount={teamsCount} />
                    </Flex>

                    <DescriptionBlock description={department.description} />
                </Flex>

                <EditButton canEdit={canEdit} onEditClick={onEditClick} />
            </Flex>
        </div>
    );
}