import { Flex, Typography, Tag, Button } from "antd";
import {
    EditOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    StopOutlined,
} from "@ant-design/icons";
import type { DepartmentType } from "../../types/departments.type";

const { Title, Text } = Typography;

function initials(text?: string) {
    const s = (text ?? "").trim();
    return s ? s.slice(0, 2).toUpperCase() : "DP";
}

type Props = {
    department: DepartmentType;
    teamsCount: number;
    onEdit: (d: DepartmentType) => void;
};

export function DepartmentDetailsHeader({ department, teamsCount, onEdit }: Props) {
    const name = department.name ?? "Département";
    const isActive = Boolean(department.is_active);

    return (
        <div
            style={{
                padding: 24,
                background:
                    "linear-gradient(135deg, rgba(22,119,255,0.18), rgba(22,119,255,0.03))",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
            }}
        >
            <Flex justify="space-between" align="start" gap={16}>
                <Flex align="start" gap={16} style={{ minWidth: 0 }}>
                    <div
                        style={{
                            width: 76,
                            height: 76,
                            borderRadius: "50%",
                            background: "#1677ff",
                            color: "#fff",
                            display: "grid",
                            placeItems: "center",
                            fontSize: 26,
                            fontWeight: 800,
                            boxShadow: "0 10px 24px rgba(22,119,255,0.25)",
                            border: "4px solid rgba(255,255,255,0.9)",
                            flexShrink: 0,
                        }}
                    >
                        {initials(name)}
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <Title level={3} style={{ margin: 0, lineHeight: 1.1 }}>
                            {name}
                        </Title>

                        <Flex align="center" gap={8} wrap="wrap" style={{ marginTop: 8 }}>


                            <Tag
                                color={isActive ? "success" : "default"}
                                style={{ borderRadius: 999, marginInlineEnd: 0 }}
                                icon={isActive ? <CheckCircleOutlined /> : <StopOutlined />}
                            >
                                {isActive ? "Actif" : "Inactif"}
                            </Tag>

                            <Tag color="default" style={{ borderRadius: 999, marginInlineEnd: 0 }}>
                                <TeamOutlined style={{ marginRight: 6 }} />
                                {teamsCount} {teamsCount > 1 ? "Équipes" : "Équipe"}
                            </Tag>
                        </Flex>

                        <Text type="secondary" style={{ display: "block", marginTop: 10 }}>
                            {department.description || "—"}
                        </Text>
                    </div>
                </Flex>

                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(department)}
                    style={{ borderRadius: 10, paddingInline: 16 }}
                >
                    Modifier
                </Button>
            </Flex>
        </div>
    );
}
