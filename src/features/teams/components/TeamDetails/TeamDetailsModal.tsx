import { Modal } from "antd";
import { useCallback } from "react";

import type { TeamType } from "../../types/teams.type";
import { TeamDetailsHeader } from "./TeamDetailsHeader";
import { TeamDetailsBody } from "./TeamDetailsBody";

interface TeamDetailsModalProps {
    open: boolean;
    team: TeamType | null;
    onClose: () => void;
    onEdit: (team: TeamType) => void;
    colorIndex: number;
    loading?: boolean;
}

export function TeamDetailsModal({
                                     open,
                                     team,
                                     onClose,
                                     onEdit,
                                     colorIndex,
                                     loading = false,
                                 }: TeamDetailsModalProps) {

    const handleEdit = useCallback(() => {
        if (!team) return;
        onEdit(team);
        onClose();
    }, [team, onEdit, onClose]);

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
                        onEditClick={handleEdit}
                    />

                    <TeamDetailsBody
                        team={team}
                        colorIndex={colorIndex}
                    />
                </>
            )}
        </Modal>
    );
}
