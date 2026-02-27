// ./features/planning/scheduleAssignment/components/AssignmentStatusTag.tsx
import { Tag } from "antd";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";

type Props = {
    isActive:  boolean;
    isExpired: boolean;
};

export function AssignmentStatusTag({ isActive, isExpired }: Props) {
    if (isActive && !isExpired) {
        return <Tag icon={<CheckCircleOutlined />} color="success">Actif</Tag>;
    }
    if (isExpired) {
        return <Tag color="default">Expiré</Tag>;
    }
    return <Tag icon={<StopOutlined />} color="error">Inactif</Tag>;
}