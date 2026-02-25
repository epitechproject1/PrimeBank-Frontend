import { Modal } from "antd";
import { useCallback } from "react";

import type { TeamType } from "../../types/teams.type";
import { TeamDetailsHeader } from "./TeamDetailsHeader";
import { TeamDetailsBody } from "./TeamDetailsBody";

interface TeamDetailsModalProps {
    open: boolean;
    team: TeamType | null;
    onClose: () => void;

    onEdit?: (team: TeamType) => void;

    canEdit?: boolean;

    colorIndex: number;
    loading?: boolean;
}

export function TeamDetailsModal({
                                     open,
                                     team,
                                     onClose,
                                     onEdit,
                                     canEdit = false,
                                     colorIndex,
                                     loading = false,
                                 }: TeamDetailsModalProps) {
    const handleEdit = useCallback(() => {
        if (!team) return;
        if (!canEdit) return;
        if (!onEdit) return;

        onEdit(team);
        onClose();
    }, [team, canEdit, onEdit, onClose]);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={880}
            centered
            destroyOnClose
            confirmLoading={loading}
            styles={{
                body: {
                    padding: 0,
                    maxHeight: "84vh",
                    overflowY: "auto",
                    overflowX: "hidden",
                    background: "#fff",
                    borderRadius: 16,
                },
            }}
        >
            {team && (
                <>
                    <TeamDetailsHeader
                        team={team}
                        colorIndex={colorIndex}
                        canEdit={canEdit}
                        onEditClick={canEdit ? handleEdit : undefined}
                    />

                    <TeamDetailsBody team={team} colorIndex={colorIndex} />
                </>
            )}
        </Modal>
    );
}