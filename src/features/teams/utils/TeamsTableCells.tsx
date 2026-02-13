import { Avatar, Button, Popconfirm, Space, Tag, Tooltip, Typography } from "antd";
import { BankOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { TeamType } from "../types/teams.type";
import { AVATAR_COLORS, TAG_COLORS, getInitials } from "./teams-constants";

const { Text } = Typography;

export type TeamsTableHandlers = {
    onEdit: (team: TeamType) => void;
    onDelete: (id: number) => void;
    onView: (team: TeamType, index: number) => void;
    saving: boolean;
};

export function TeamNameCell({ name, team, index }: { name: string; team: TeamType; index: number }) {
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
    return (
        <Space>
            <Avatar size={40} style={{ backgroundColor: color, fontWeight: 600, boxShadow: `0 2px 8px ${color}30` }}>
                {getInitials(name)}
            </Avatar>
            <div>
                <Text strong style={{ display: "block", fontSize: 14 }}>
                    {name}
                </Text>
                {team.department && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {team.department.name}
                    </Text>
                )}
            </div>
        </Space>
    );
}

export function DescriptionCell({ desc }: { desc?: string | null }) {
    const text = desc?.trim() ? desc : "Aucune description";
    return (
        <Tooltip placement="topLeft" title={desc ?? ""}>
            <Text type="secondary" style={{ fontSize: 13 }}>
                {text}
            </Text>
        </Tooltip>
    );
}

export function DepartmentCell({ dept, index }: { dept: TeamType["department"]; index: number }) {
    if (!dept) {
        return (
            <Text type="secondary" style={{ fontStyle: "italic" }}>
                Non assigné
            </Text>
        );
    }
    return (
        <Tag
            color={TAG_COLORS[index % TAG_COLORS.length]}
            icon={<BankOutlined />}
            style={{ borderRadius: 6, fontSize: 12, padding: "4px 10px" }}
        >
            {dept.name ?? `Dept #${dept.id}`}
        </Tag>
    );
}

export function OwnerCell({ owner }: { owner: TeamType["owner"] }) {
    if (!owner) {
        return (
            <Text type="secondary" style={{ fontStyle: "italic" }}>
                Aucun responsable
            </Text>
        );
    }
    const initials = getInitials(`${owner.first_name ?? ""} ${owner.last_name ?? ""}`.trim());
    return (
        <Space size={8}>
            <Avatar size={28} style={{ backgroundColor: "#1890ff", fontSize: 12 }}>
                {initials}
            </Avatar>
            <div>
                <Text style={{ fontSize: 13 }}>
                    {owner.first_name} {owner.last_name}
                </Text>
                {owner.email && (
                    <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                        {owner.email}
                    </Text>
                )}
            </div>
        </Space>
    );
}

export function MembersCountCell({ team }: { team: TeamType }) {
    const membersCount = typeof team.members_count === "number" ? team.members_count : 0;
    return (
        <Tag color="default" style={{ borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
            {membersCount}
        </Tag>
    );
}

export function ActionsCell({ team, index, handlers }: { team: TeamType; index: number; handlers: TeamsTableHandlers }) {
    return (
        <Space size={4}>
            <Tooltip title="Voir les détails">
                <Button type="text" icon={<EyeOutlined />} onClick={() => handlers.onView(team, index)} style={{ borderRadius: 6 }} />
            </Tooltip>
            <Tooltip title="Modifier">
                <Button type="text" icon={<EditOutlined />} onClick={() => handlers.onEdit(team)} style={{ borderRadius: 6 }} />
            </Tooltip>
            <Popconfirm
                title="Supprimer cette équipe ?"
                description="Cette action est irréversible."
                okText="Supprimer"
                cancelText="Annuler"
                okButtonProps={{ danger: true, loading: handlers.saving }}
                onConfirm={() => handlers.onDelete(team.id)}
            >
                <Tooltip title="Supprimer">
                    <Button type="text" danger icon={<DeleteOutlined />} style={{ borderRadius: 6 }} />
                </Tooltip>
            </Popconfirm>
        </Space>
    );
}
