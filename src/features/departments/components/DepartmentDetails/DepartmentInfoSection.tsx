import { Typography, Descriptions, Space, Tag } from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    StopOutlined,
} from "@ant-design/icons";
import type { DepartmentType } from "../../types/departments.type";

const { Title } = Typography;

type DateFields = {
    createdAt?: string | Date | null;
    updatedAt?: string | Date | null;
};

function getDepartmentDates(dept: DepartmentType): DateFields {
    const d = dept as unknown as {
        created_at?: string | Date | null;
        updated_at?: string | Date | null;
        createdAt?: string | Date | null;
        updatedAt?: string | Date | null;
    };
    return {
        createdAt: d.created_at ?? d.createdAt ?? null,
        updatedAt: d.updated_at ?? d.updatedAt ?? null,
    };
}

function formatDate(value?: string | Date | null) {
    if (!value) return "—";
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(d);
}

type Props = {
    department: DepartmentType;
};

export function DepartmentInfoSection({ department }: Props) {
    const isActive = Boolean(department.is_active);
    const { createdAt, updatedAt } = getDepartmentDates(department);

    return (
        <>
            <Title level={5} style={{ marginTop: 0 }}>
                Informations du département
            </Title>

            <Descriptions bordered size="middle" column={1} style={{ borderRadius: 12, overflow: "hidden" }}>
                <Descriptions.Item
                    label={
                        <Space>
                            <CalendarOutlined />
                            <span>Date de création</span>
                        </Space>
                    }
                >
                    {formatDate(createdAt)}
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <ClockCircleOutlined />
                            <span>Dernière modification</span>
                        </Space>
                    }
                >
                    {formatDate(updatedAt)}
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            {isActive ? <CheckCircleOutlined /> : <StopOutlined />}
                            <span>Statut</span>
                        </Space>
                    }
                >
                    <Tag color={isActive ? "success" : "default"} style={{ borderRadius: 999 }}>
                        {isActive ? "Actif" : "Inactif"}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>
        </>
    );
}
