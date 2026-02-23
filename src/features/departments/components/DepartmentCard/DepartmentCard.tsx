import { Card, Flex, Typography, Tag, Button, Tooltip } from "antd";
import {
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import type { DepartmentType } from "../../types/departments.type";

const { Text, Title } = Typography;

type Props = {
    department: DepartmentType;
    onEdit: (d: DepartmentType) => void;
    onDelete: (id: number) => void;
    onView?: (d: DepartmentType) => void;
};

type HeaderProps = {
    department: DepartmentType;
    name: string;
    initials: string;
    onEdit: (d: DepartmentType) => void;
    onDelete: (id: number) => void;
    onView?: (d: DepartmentType) => void;
};

function DepartmentCardHeader({
                                  department,
                                  name,
                                  initials,
                                  onEdit,
                                  onDelete,
                                  onView,
                              }: HeaderProps) {
    return (
        <div
            style={{
                padding: 16,
                background: "linear-gradient(135deg, rgba(22,119,255,0.10), rgba(22,119,255,0.02))",
            }}
        >
            <Flex align="start" justify="space-between" gap={12}>
                <Flex align="center" gap={12} style={{ minWidth: 0 }}>
                    <div
                        style={{
                            width: 54,
                            height: 54,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            background: "#1677ff",
                            color: "white",
                            fontWeight: 700,
                            fontSize: 18,
                            boxShadow: "0 6px 18px rgba(22,119,255,0.25)",
                            flexShrink: 0,
                        }}
                    >
                        {initials}
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <Flex align="center" gap={8} style={{ minWidth: 0 }}>
                            <Title
                                level={5}
                                style={{ margin: 0, lineHeight: 1.2 }}
                                ellipsis={{ tooltip: name }}
                            >
                                {name}
                            </Title>

                            <Tag
                                color={department.is_active ? "success" : "default"}
                                style={{ marginInlineEnd: 0 }}
                            >
                                {department.is_active ? "Actif" : "Inactif"}
                            </Tag>
                        </Flex>

                    </div>
                </Flex>

                <Flex gap={6}>
                    <Tooltip title="Voir">
                        <Button icon={<EyeOutlined />} onClick={() => onView?.(department)} />
                    </Tooltip>

                    <Tooltip title="Modifier">
                        <Button icon={<EditOutlined />} onClick={() => onEdit(department)} />
                    </Tooltip>

                    <Tooltip title="Supprimer">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => onDelete(department.id)}
                        />
                    </Tooltip>
                </Flex>
            </Flex>
        </div>
    );
}

function DepartmentCardDescription({ description }: { description?: string | null }) {
    return (
        <div style={{ padding: 16, minHeight: 72 }}>
            <Text type={description ? undefined : "secondary"}>
                {description || "Aucune description."}
            </Text>
        </div>
    );
}

type FooterProps = {
    directorName: string;
    membersCount: number;
    onView?: () => void;
};

function DepartmentCardFooter({ directorName, membersCount, onView }: FooterProps) {
    return (
        <div style={{ padding: "0 16px 16px" }}>
            <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
                <Flex align="center" gap={8} style={{ minWidth: 0 }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "rgba(22,119,255,0.08)",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                        }}
                    >
                        <UserOutlined style={{ color: "#1677ff" }} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Directeur
                        </Text>
                        <div style={{ fontWeight: 600 }}>
                            <Text ellipsis style={{ maxWidth: 180, display: "inline-block" }}>
                                {directorName}
                            </Text>
                        </div>
                    </div>
                </Flex>

                <Flex align="center" gap={8}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "rgba(82,196,26,0.10)",
                            display: "grid",
                            placeItems: "center",
                        }}
                    >
                        <TeamOutlined style={{ color: "#52c41a" }} />
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Équipes
                        </Text>
                        <div style={{ fontWeight: 700 }}>{membersCount}</div>
                    </div>
                </Flex>
            </Flex>

            <div style={{ marginTop: 12, textAlign: "center" }}>
                <Button type="link" icon={<EyeOutlined />} onClick={onView}>
                    Voir les détails
                </Button>
            </div>
        </div>
    );
}

export function DepartmentCard({ department, onEdit, onDelete, onView }: Props) {
    const directorName = department.director
        ? `${department.director.first_name} ${department.director.last_name}`
        : "—";

    const name = department.name ?? "-";
    const initialsValue = name.slice(0, 2).toUpperCase();
    const membersCount = department.teams_count ?? 0;

    return (
        <Card
            hoverable
            style={{
                width: "100%",
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
                transition: "all 220ms ease",
                background: "rgba(255,255,255,0.92)",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 18px 52px rgba(0,0,0,0.10)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 26px rgba(0,0,0,0.06)";
            }}
            styles={{ body: { padding: 0 } }}
        >

        <DepartmentCardHeader
                department={department}
                name={name}
                initials={initialsValue}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
            />

            <DepartmentCardDescription description={department.description} />

            <DepartmentCardFooter
                directorName={directorName}
                membersCount={membersCount}
                onView={() => onView?.(department)}
            />
        </Card>
    );
}
