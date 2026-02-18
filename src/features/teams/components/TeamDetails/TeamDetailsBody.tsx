import { Typography } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import { useMemo, useState, useCallback } from "react";

import type { TeamType, TeamMember } from "../../types/teams.type";
import { TeamDetailsStats } from "./TeamDetailsStats";
import { TeamMembersList } from "./TeamMembersList";
import { TeamDetailsInfo } from "./TeamDetailsInfo";

const { Text } = Typography;

interface Props {
    team: TeamType;
    colorIndex: number;
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

export function TeamDetailsBody({ team, colorIndex }: Props) {
    const leaderName = useMemo(() => getLeaderName(team), [team]);
    const members = useMemo(() => getTeamMembers(team), [team]);

    const [overrideCount, setOverrideCount] = useState<number | null>(null);

    const displayedMembersCount = useMemo(() => {
        if (overrideCount !== null) return overrideCount;
        return team.members_count ?? members.length ?? 0;
    }, [team.members_count, members.length, overrideCount]);

    const handleTotalChange = useCallback((total: number) => {
        setOverrideCount(total);
    }, []);

    return (
        <div style={{ padding: "22px 26px 26px", background: "#fff" }}>
            <TeamDetailsStats team={team} members={members} leaderName={leaderName} />

            <TeamDetailsInfo team={team} />

            <Text strong style={{ display: "block", marginBottom: 10 }}>
                <TeamOutlined /> Membres de l’équipe ({displayedMembersCount})
            </Text>

            <TeamMembersList
                key={team.id}
                team={team}
                colorIndex={colorIndex}
                onTotalChange={handleTotalChange}
            />
        </div>
    );
}
