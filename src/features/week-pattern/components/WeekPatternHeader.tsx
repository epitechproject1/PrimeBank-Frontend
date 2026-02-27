import { Typography, Button, Space, Popconfirm, theme, Tooltip, Tag } from "antd";
import {
    ReloadOutlined,
    CopyOutlined,
    EditOutlined,
    DeleteOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import type { WeekPattern } from "../types/weekPattern.types";

const { Text, Title } = Typography;

type Props = {
    selected: WeekPattern;
    loading: boolean;
    totalWorkHours: number;
    onRefresh: () => void;
    onDuplicate: (pattern: WeekPattern) => void;
    onEdit: (pattern: WeekPattern) => void;
    onDelete: (id: number) => Promise<void>;
};

export function WeekPatternHeader({
                                      selected,
                                      loading,
                                      totalWorkHours,
                                      onRefresh,
                                      onDuplicate,
                                      onEdit,
                                      onDelete,
                                  }: Props) {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                background: token.colorBgContainer,
                padding: "16px 20px",
                borderRadius: token.borderRadiusLG,
                marginBottom: 16,
                border: `1px solid ${token.colorBorderSecondary}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
            }}
        >
            {/* Infos gauche */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: token.borderRadiusLG,
                        background: token.colorPrimaryBg,
                        border: `1px solid ${token.colorPrimaryBorder}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <ClockCircleOutlined
                        style={{ fontSize: 20, color: token.colorPrimary }}
                    />
                </div>

                <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <Title level={5} style={{ margin: 0, lineHeight: 1.3 }}>
                            {selected.name}
                        </Title>
                        <Tag
                            color="blue"
                            style={{ margin: 0, fontWeight: 600, fontSize: 12 }}
                        >
                            {totalWorkHours.toFixed(1)} h / semaine
                        </Tag>
                    </div>

                    <Text
                        type="secondary"
                        style={{ fontSize: 13, display: "block", marginTop: 2 }}
                        ellipsis
                    >
                        {selected.description || "Aucune description"}
                    </Text>
                </div>
            </div>

            {/* Actions droite */}
            <Space wrap size={6}>
                <Tooltip title="Rafraîchir">
                    <Button
                        icon={<ReloadOutlined />}
                        loading={loading}
                        onClick={onRefresh}
                        size="middle"
                    />
                </Tooltip>

                <Tooltip title="Dupliquer ce modèle">
                    <Button
                        icon={<CopyOutlined />}
                        onClick={() => onDuplicate(selected)}
                        size="middle"
                    >
                        Dupliquer
                    </Button>
                </Tooltip>

                <Button
                    icon={<EditOutlined />}
                    onClick={() => onEdit(selected)}
                    size="middle"
                    type="default"
                >
                    Modifier
                </Button>

                <Popconfirm
                    title="Supprimer ce modèle ?"
                    description="Cette action est irréversible."
                    okText="Supprimer"
                    cancelText="Annuler"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => onDelete(selected.id)}
                >
                    <Button danger icon={<DeleteOutlined />} size="middle">
                        Supprimer
                    </Button>
                </Popconfirm>
            </Space>
        </div>
    );
}