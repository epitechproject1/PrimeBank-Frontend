import { Avatar, Button, Popconfirm, Space, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { DepartmentType } from "../../types/departments.type";

const { Text } = Typography;

export type ColumnsParams = {
    onView?: (d: DepartmentType) => void;
    onEdit: (d: DepartmentType) => void;
    onDelete: (id: number) => void;
    deletingId?: number | null;
};

function initials(name?: string) {
    const s = (name ?? "").trim();
    return s ? s.slice(0, 2).toUpperCase() : "DP";
}

function getDirectorName(director: DepartmentType["director"]) {
    if (!director) return null;
    const full = `${director.first_name ?? ""} ${director.last_name ?? ""}`.trim();
    return full || null;
}

function departmentNameColumn(): ColumnType<DepartmentType> {
    return {
        title: "Département",
        dataIndex: "name",
        key: "name",
        fixed: "left",
        width: 260,
        render: (name: string) => (
            <Space size={10}>
                <Avatar style={{ background: "#1677ff", fontWeight: 800 }}>{initials(name)}</Avatar>

                <div style={{ minWidth: 0 }}>
                    <Text strong ellipsis style={{ maxWidth: 180, display: "block", fontSize: 14 }}>
                        {name}
                    </Text>
                </div>
            </Space>
        ),
    };
}

function descriptionColumn(): ColumnType<DepartmentType> {
    return {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: 320,
        ellipsis: { showTitle: false },
        render: (desc: string | null) => (
            <Tooltip placement="topLeft" title={desc ?? ""}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                    {desc?.trim() ? desc : "Aucune description"}
                </Text>
            </Tooltip>
        ),
    };
}

function directorColumn(): ColumnType<DepartmentType> {
    return {
        title: "Directeur",
        dataIndex: "director",
        key: "director",
        width: 240,
        render: (director: DepartmentType["director"]) => {
            const name = getDirectorName(director);

            if (!director || !name) {
                return (
                    <Text type="secondary" style={{ fontStyle: "italic" }}>
                        Aucun directeur
                    </Text>
                );
            }

            return (
                <Space size={8}>
                    <Avatar size={28} style={{ backgroundColor: "#1890ff", fontSize: 12 }}>
                        {initials(name)}
                    </Avatar>

                    <div style={{ minWidth: 0 }}>
                        <Text style={{ fontSize: 13 }} ellipsis>
                            {name}
                        </Text>

                        {director.email ? (
                            <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                                {director.email}
                            </Text>
                        ) : null}
                    </div>
                </Space>
            );
        },
    };
}

function teamsCountColumn(): ColumnType<DepartmentType> {
    return {
        title: "Équipes",
        dataIndex: "teams_count",
        key: "teams_count",
        width: 110,
        align: "center",
        render: (v?: number) => (
            <Tag color="default" style={{ borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
                {typeof v === "number" ? v : 0}
            </Tag>
        ),
    };
}

function statusColumn(): ColumnType<DepartmentType> {
    return {
        title: "Statut",
        dataIndex: "is_active",
        key: "is_active",
        width: 130,
        align: "center",
        render: (active: boolean) => (
            <Tag
                color={active ? "green" : "default"}
                style={{ borderRadius: 8, fontSize: 12, padding: "4px 10px", fontWeight: 600 }}
            >
                {active ? "Actif" : "Inactif"}
            </Tag>
        ),
    };
}

function actionsColumn(params: ColumnsParams): ColumnType<DepartmentType> {
    const { onView, onEdit, onDelete, deletingId } = params;

    return {
        title: "Actions",
        key: "actions",
        align: "right",
        fixed: "right",
        width: 140,
        render: (_: unknown, record: DepartmentType) => (
            <Space size={4}>
                {onView ? (
                    <Tooltip title="Voir les détails">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => onView(record)}
                            style={{ borderRadius: 6 }}
                        />
                    </Tooltip>
                ) : null}

                <Tooltip title="Modifier">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                        style={{ borderRadius: 6 }}
                    />
                </Tooltip>

                <Popconfirm
                    title="Supprimer ce département ?"
                    description="Cette action est irréversible."
                    okText="Supprimer"
                    cancelText="Annuler"
                    okButtonProps={{ danger: true, loading: deletingId === record.id }}
                    onConfirm={() => onDelete(record.id)}
                >
                    <Tooltip title="Supprimer">
                        <Button type="text" danger icon={<DeleteOutlined />} style={{ borderRadius: 6 }} />
                    </Tooltip>
                </Popconfirm>
            </Space>
        ),
    };
}

export function buildDepartmentsTableColumns(params: ColumnsParams): ColumnsType<DepartmentType> {
    return [
        departmentNameColumn(),
        descriptionColumn(),
        directorColumn(),
        teamsCountColumn(),
        statusColumn(),
        actionsColumn(params),
    ];
}
