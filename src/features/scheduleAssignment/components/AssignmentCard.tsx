// ./features/planning/scheduleAssignment/components/AssignmentCard.tsx
import { Avatar, Button, Card, Flex, Popconfirm, Tag, Tooltip, Typography, theme } from "antd";
import {
    CalendarOutlined, DeleteOutlined,
    EditOutlined, ThunderboltOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { AliasToken } from "antd/es/theme/interface";
import type { ScheduleAssignment } from "../types/scheduleAssignment.types";

const { Text } = Typography;

export type AssignmentCardProps = {
    assignment: ScheduleAssignment;
    onClick:    (a: ScheduleAssignment) => void;
    onEdit:     (a: ScheduleAssignment) => void;
    onDelete:   (id: number) => void;
    onGenerate: (a: ScheduleAssignment) => void;
};

// ── Helpers ────────────────────────────────────────────────────────────
function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function resolveUser(a: ScheduleAssignment) {
    const user = a.contract_detail?.user_detail;
    return user ? `${user.first_name} ${user.last_name}` : `Contrat #${a.contract}`;
}

function resolveStatus(a: ScheduleAssignment) {
    const isExpired = !!a.end_date && dayjs(a.end_date).isBefore(dayjs(), "day");
    return { isActive: a.is_active, isExpired };
}

// ── Sub-components ─────────────────────────────────────────────────────
type StatusTagProps = { isActive: boolean; isExpired: boolean };

function StatusTag({ isActive, isExpired }: StatusTagProps) {
    if (isActive && !isExpired) return <Tag color="success">Actif</Tag>;
    if (isExpired)              return <Tag color="default">Expiré</Tag>;
    return                             <Tag color="error">Inactif</Tag>;
}

type CardActionsProps = {
    assignment: ScheduleAssignment;
    onEdit:     (a: ScheduleAssignment) => void;
    onDelete:   (id: number) => void;
    onGenerate: (a: ScheduleAssignment) => void;
};

function CardActions({ assignment, onEdit, onDelete, onGenerate }: CardActionsProps) {
    return (
        <Flex gap={6} onClick={(e) => e.stopPropagation()}>
            <Tooltip title="Modifier">
                <Button
                    size="small" icon={<EditOutlined />}
                    onClick={() => onEdit(assignment)}
                    style={{ flex: 1, fontWeight: 600 }}
                >
                    Modifier
                </Button>
            </Tooltip>
            <Tooltip title="Générer les shifts">
                <Button
                    size="small" type="primary" icon={<ThunderboltOutlined />}
                    onClick={() => onGenerate(assignment)}
                    style={{ flex: 1, fontWeight: 600 }}
                >
                    Générer
                </Button>
            </Tooltip>
            <Popconfirm
                title="Supprimer cette affectation ?"
                okText="Supprimer" cancelText="Annuler"
                okButtonProps={{ danger: true }}
                onConfirm={() => onDelete(assignment.id)}
            >
                <Tooltip title="Supprimer">
                    <Button size="small" danger icon={<DeleteOutlined />} />
                </Tooltip>
            </Popconfirm>
        </Flex>
    );
}

// Fonction helper pour déterminer la couleur de fin sans ternaire imbriqué
function getEndColor(
    endDate: string | null | undefined,
    isExpired: boolean,
    token: AliasToken
) {
    if (!endDate) return token.colorSuccess;
    if (isExpired) return token.colorError;
    return token.colorText;
}

// ── Main component ─────────────────────────────────────────────────────
export function AssignmentCard({ assignment, onClick, onEdit, onDelete, onGenerate }: AssignmentCardProps) {
    const { token } = theme.useToken();
    const a = assignment;
    const userName = resolveUser(a);
    const patternName = a.week_pattern_detail?.name ?? `Pattern #${a.week_pattern}`;
    const contractType = a.contract_detail?.contract_type_detail?.name;
    const { isActive, isExpired } = resolveStatus(a);

    const startFmt = dayjs(a.start_date).format("DD MMM YYYY");
    const endFmt   = a.end_date ? dayjs(a.end_date).format("DD MMM YYYY") : "En cours";
    const endColor = getEndColor(a.end_date, isExpired, token);

    return (
        <Card
            hoverable
            onClick={() => onClick(a)}
            style={{
                cursor: "pointer",
            }}
        >
            {/* Top row */}
            <Flex justify="space-between" align="flex-start" style={{ marginBottom: 14 }}>
                <Flex align="center" gap={10}>
                    <Avatar style={{ background: token.colorPrimaryBg, color: token.colorPrimary, fontWeight: 700 }}>
                        {getInitials(userName)}
                    </Avatar>
                    <div>
                        <Text strong style={{ display: "block" }}>{userName}</Text>
                        {contractType && <Text type="secondary" style={{ fontSize: 11 }}>{contractType}</Text>}
                    </div>
                </Flex>
                <StatusTag isActive={isActive} isExpired={isExpired} />
            </Flex>

            {/* Pattern */}
            <Flex
                align="center" gap={8}
                style={{
                    padding: "8px 12px", borderRadius: token.borderRadius,
                    background: token.colorFillAlter, marginBottom: 12,
                }}
            >
                <CalendarOutlined style={{ color: token.colorPrimary }} />
                <Text strong style={{ fontSize: 13 }}>{patternName}</Text>
            </Flex>

            {/* Dates */}
            <Flex align="center" gap={6} style={{ marginBottom: 14 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>{startFmt}</Text>
                <Text type="secondary">→</Text>
                <Text style={{ fontSize: 12, color: endColor, fontWeight: a.end_date ? 400 : 600 }}>
                    {endFmt}
                </Text>
            </Flex>

            {/* Actions */}
            <div style={{ paddingTop: 12, borderTop: `1px solid ${token.colorBorderSecondary}` }}>
                <CardActions assignment={a} onEdit={onEdit} onDelete={onDelete} onGenerate={onGenerate} />
            </div>
        </Card>
    );
}