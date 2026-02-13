import { Modal, Typography, Descriptions, Space } from "antd";
import { BankOutlined, CalendarOutlined, ClockCircleOutlined, TeamOutlined } from "@ant-design/icons";
import { useMemo, useCallback } from "react";

import type { TeamMember, TeamType } from "../types/teams.type";
import { formatDate } from "../utils/teams-constants";
import { TeamDetailsHeader } from "./team-details/TeamDetailsHeader";
import { TeamDetailsStats } from "./team-details/TeamDetailsStats";
import { TeamMembersList } from "./team-details/TeamMembersList";

const { Title, Text } = Typography;

interface TeamDetailsModalProps {
    open: boolean;
    team: TeamType | null;
    onClose: () => void;
    onEdit: (team: TeamType) => void;
    colorIndex: number;
    loading?: boolean;
}

function getLeaderName(team: TeamType): string {
    if (!team.owner) return "Aucun responsable";
    const full = `${team.owner.first_name ?? ""} ${team.owner.last_name ?? ""}`.trim();
    return full || "Responsable";
}

function getTeamMembers(team: TeamType): TeamMember[] {
    if (Array.isArray(team.members) && team.members.length > 0) return team.members;
    if (Array.isArray(team.members_preview) && team.members_preview.length > 0) return team.members_preview;
    return [];
}

export function TeamDetailsModal({
                                     open,
                                     team,
                                     onClose,
                                     onEdit,
                                     colorIndex,
                                     loading = false,
                                 }: TeamDetailsModalProps) {
    const leaderName = useMemo(() => (team ? getLeaderName(team) : ""), [team]);
    const members = useMemo(() => (team ? getTeamMembers(team) : []), [team]);

    const handleEdit = useCallback(() => {
        if (!team) return;
        onEdit(team);
        onClose();
    }, [team, onEdit, onClose]);

    if (!team) return null;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            style={{ top: 20 }}
            styles={{ body: { padding: 0 } }}
            confirmLoading={loading}
        >
            <TeamDetailsHeader team={team} colorIndex={colorIndex} onEditClick={handleEdit} />

            <div style={{ padding: "24px 32px 32px" }}>
                <TeamDetailsStats team={team} members={members} leaderName={leaderName} />

                <Descriptions
                    title={<Text strong>Informations de l&apos;équipe</Text>}
                    bordered
                    column={1}
                    size="small"
                    style={{ marginBottom: 24, borderRadius: 12, overflow: "hidden" }}
                >
                    <Descriptions.Item label={<Space><CalendarOutlined /> Date de création</Space>}>
                        {formatDate(team.created_at)}
                    </Descriptions.Item>

                    <Descriptions.Item label={<Space><ClockCircleOutlined /> Dernière modification</Space>}>
                        {formatDate(team.updated_at)}
                    </Descriptions.Item>

                    {team.department ? (
                        <Descriptions.Item label={<Space><BankOutlined /> Département</Space>}>
                            {team.department.name ?? `Département #${team.department.id}`}
                        </Descriptions.Item>
                    ) : null}
                </Descriptions>

                <Title level={5} style={{ marginBottom: 16 }}>
                    <TeamOutlined /> Membres de l&apos;équipe ({team.members_count})
                </Title>

                <TeamMembersList team={team} members={members} colorIndex={colorIndex} />
            </div>
        </Modal>
    );
}
