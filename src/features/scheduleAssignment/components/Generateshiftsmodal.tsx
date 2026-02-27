// ./features/planning/scheduleAssignment/components/GenerateShiftsModal.tsx
import { useState } from "react";
import { Modal, Switch, Typography, Flex, Alert } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";

import type { ScheduleAssignment } from "../types/scheduleAssignment.types";
import type { GenerateShiftsResponse } from "../services/scheduleAssignments.service";

const { Text } = Typography;

type Props = {
    open: boolean;
    assignment: ScheduleAssignment | null;
    onClose: () => void;

    onGenerate: (
        id: number,
        includeHolidays: boolean
    ) => Promise<GenerateShiftsResponse>;
};

export function GenerateShiftsModal({
                                        open,
                                        assignment,
                                        onClose,
                                        onGenerate,
                                    }: Props) {
    const [includeHolidays, setIncludeHolidays] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!assignment) return;

        setLoading(true);
        try {
            await onGenerate(assignment.id, includeHolidays);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIncludeHolidays(false);
        onClose();
    };

    return (
        <Modal
            open={open}
            title={
                <Flex align="center" gap={8}>
                    <ThunderboltOutlined style={{ color: "#52c41a" }} />
                    <span>Générer les shifts</span>
                </Flex>
            }
            okText="Générer"
            cancelText="Annuler"
            okButtonProps={{ loading, icon: <ThunderboltOutlined /> }}
            onOk={handleConfirm}
            onCancel={handleCancel}
            destroyOnClose
        >
            <Flex vertical gap={16} style={{ paddingTop: 8 }}>
                <Alert
                    type="info"
                    showIcon
                    message="Cette action va créer des shifts à partir de la semaine type associée."
                />

                <Flex justify="space-between" align="center">
                    <div>
                        <Text strong>Inclure les jours fériés</Text>
                        <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                            Génère aussi des shifts sur les jours fériés
                        </Text>
                    </div>

                    <Switch
                        checked={includeHolidays}
                        onChange={setIncludeHolidays}
                    />
                </Flex>
            </Flex>
        </Modal>
    );
}