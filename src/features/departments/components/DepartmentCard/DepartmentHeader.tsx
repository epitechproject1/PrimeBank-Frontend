import { Flex, Typography, Button, Tooltip, Popconfirm } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    CheckCircleFilled,
    MinusCircleFilled,
} from "@ant-design/icons";

const { Text, Title } = Typography;

type Props = {
    name: string;
    initials: string;
    isActive: boolean;
    canEdit: boolean;
    canDelete: boolean;
    onEdit: () => void;
    onDelete: () => void;
};
function DepartmentAvatar({ initials }: { initials: string }) {
    return (
        <div
            style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "#1677ff",
                color: "white",
                fontWeight: 800,
                fontSize: 18,
                boxShadow: "0 10px 24px rgba(22,119,255,0.28)",
                flexShrink: 0,
            }}
        >
            {initials}
        </div>
    );
}
function DepartmentStatus({ isActive }: { isActive: boolean }) {
    const icon = isActive ? (
        <CheckCircleFilled style={{ color: "#52c41a" }} />
    ) : (
        <MinusCircleFilled style={{ color: "rgba(0,0,0,0.35)" }} />
    );

    const label = isActive ? "Actif" : "Inactif";

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.04)",
                fontSize: 12,
                fontWeight: 500,
            }}
        >
      {icon}
            {label}
    </span>
    );
}

function DepartmentActions({
                               canEdit,
                               canDelete,
                               onEdit,
                               onDelete,
                           }: {
    canEdit: boolean;
    canDelete: boolean;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <Flex gap={6} onClick={(e) => e.stopPropagation()}>
            {canEdit && (
                <Tooltip title="Modifier">
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                    />
                </Tooltip>
            )}

            {canDelete && (
                <Popconfirm
                    title="Supprimer ce département ?"
                    description="Cette action est irréversible."
                    okText="Supprimer"
                    cancelText="Annuler"
                    okButtonProps={{ danger: true }}
                    onConfirm={onDelete}
                >
                    <Tooltip title="Supprimer">
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Tooltip>
                </Popconfirm>
            )}
        </Flex>
    );
}

export function DepartmentHeader({
                                     name,
                                     initials,
                                     isActive,
                                     canEdit,
                                     canDelete,
                                     onEdit,
                                     onDelete,
                                 }: Props) {
    return (
        <div
            style={{
                padding: 16,
                background:
                    "linear-gradient(135deg, rgba(22,119,255,0.12), rgba(22,119,255,0.03))",
            }}
        >
            <Flex align="start" justify="space-between" gap={12}>
                <Flex align="center" gap={12} style={{ minWidth: 0 }}>
                    <DepartmentAvatar initials={initials} />

                    <div style={{ minWidth: 0 }}>
                        <Title
                            level={5}
                            style={{ margin: 0, lineHeight: 1.2 }}
                            ellipsis={{ tooltip: name }}
                        >
                            {name}
                        </Title>

                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Cliquer sur la carte pour voir les détails
                        </Text>

                        <div style={{ marginTop: 8 }}>
                            <DepartmentStatus isActive={isActive} />
                        </div>
                    </div>
                </Flex>

                <DepartmentActions
                    canEdit={canEdit}
                    canDelete={canDelete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </Flex>
        </div>
    );
}