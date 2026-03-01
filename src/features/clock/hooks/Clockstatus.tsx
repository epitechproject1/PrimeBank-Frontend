// src/features/shift/utils/clockStatus.tsx

import { Tag } from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    MinusCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";

export type ClockStatus =
    | "NOT_STARTED"
    | "CLOCK_IN_PENDING"
    | "IN_PROGRESS"
    | "CLOCK_OUT_PENDING"
    | "COMPLETED";

interface StatusConfig {
    label: string;
    color: string;
    icon: React.ReactNode;
}

const STATUS_MAP: Record<ClockStatus, StatusConfig> = {
    NOT_STARTED: {
        label: "Non pointé",
        color: "default",
        icon: <MinusCircleOutlined />,
    },
    CLOCK_IN_PENDING: {
        label: "Entrée en attente",
        color: "warning",
        icon: <ExclamationCircleOutlined />,
    },
    IN_PROGRESS: {
        label: "En cours",
        color: "processing",
        icon: <SyncOutlined spin />,
    },
    CLOCK_OUT_PENDING: {
        label: "Sortie en attente",
        color: "warning",
        icon: <ExclamationCircleOutlined />,
    },
    COMPLETED: {
        label: "Terminé",
        color: "success",
        icon: <CheckCircleOutlined />,
    },
};

export function renderClockStatusTag(status: string) {
    const config = STATUS_MAP[status as ClockStatus];
    if (!config) return <Tag icon={<ClockCircleOutlined />}>{status}</Tag>;
    return (
        <Tag color={config.color} icon={config.icon}>
            {config.label}
        </Tag>
    );
}

export function getErrorMessage(error: any): string {
    const data = error?.response?.data;
    if (!data) return "Une erreur est survenue";
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    if (data.non_field_errors?.length) return data.non_field_errors[0];
    const firstKey = Object.keys(data)[0];
    if (firstKey && Array.isArray(data[firstKey])) return data[firstKey][0];
    return "Une erreur est survenue";
}