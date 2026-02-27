// ./features/planning/scheduleAssignment/components/DrawerHeader.tsx
import { Avatar, Button, Flex, Tag, Typography, theme } from "antd";
import { CheckCircleOutlined, CloseOutlined, StopOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { ScheduleAssignment } from "../types/scheduleAssignment.types";

const { Text, Title } = Typography;

type Props = {
    assignment: ScheduleAssignment;
    onClose:    () => void;
};

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function resolveDisplayName(a: ScheduleAssignment) {
    const user = a.contract_detail?.user_detail;
    return user ? `${user.first_name} ${user.last_name}` : `Contrat #${a.contract}`;
}

type StatusBadgeProps = { isActive: boolean; isExpired: boolean };

function StatusBadge({ isActive, isExpired }: StatusBadgeProps) {
    if (isActive && !isExpired) return <Tag icon={<CheckCircleOutlined />} color="success">Actif</Tag>;
    if (isExpired)              return <Tag color="default">Expiré</Tag>;
    return                             <Tag icon={<StopOutlined />} color="error">Inactif</Tag>;
}

export function DrawerHeader({ assignment, onClose }: Props) {
    const { token } = theme.useToken();
    const userName    = resolveDisplayName(assignment);
    const contractType = assignment.contract_detail?.contract_type_detail?.name;
    const isExpired   = !!assignment.end_date && dayjs(assignment.end_date).isBefore(dayjs(), "day");
    const isActive    = assignment.is_active;

    return (
        <div style={{
            background: isActive && !isExpired ? token.colorPrimaryBg : token.colorFillAlter,
            borderBottom: `2px solid ${isActive && !isExpired ? token.colorPrimaryBorder : token.colorBorderSecondary}`,
            padding: "20px 24px",
        }}>
            <Flex justify="space-between" align="flex-start">
                <Flex align="center" gap={14}>
                    <Avatar
                        size={52}
                        style={{ background: token.colorPrimary, fontSize: 18, fontWeight: 800 }}
                    >
                        {getInitials(userName)}
                    </Avatar>
                    <div>
                        <Title level={4} style={{ margin: 0, lineHeight: 1.2 }}>
                            {userName}
                        </Title>
                        {contractType && (
                            <Text type="secondary" style={{ fontSize: 12 }}>{contractType}</Text>
                        )}
                    </div>
                </Flex>
                <Flex align="center" gap={8}>
                    <StatusBadge isActive={isActive} isExpired={isExpired} />
                    <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
                </Flex>
            </Flex>
        </div>
    );
}