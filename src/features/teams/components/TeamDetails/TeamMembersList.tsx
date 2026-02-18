import type { TeamMember, TeamType } from "../../types/teams.type";
import { useTeamMembers } from "../../hooks/data/useTeamMembers";
import { TeamMembersToolbar } from "./TeamMembersToolbar";
import { TeamMembersContent } from "./TeamMembersContent";

interface TeamMembersListProps {
    team: TeamType;
    colorIndex: number;
    initialMembers?: TeamMember[];
    onTotalChange?: (total: number) => void;
}

export function TeamMembersList({
                                    team,
                                    colorIndex,
                                    initialMembers,
                                    onTotalChange,
                                }: TeamMembersListProps) {
    const pageSize = 6;

    const membersState = useTeamMembers({
        team,
        pageSize,
        initialMembers,
        onTotalChange,
    });

    return (
        <div>
            <TeamMembersToolbar {...membersState} />
            <TeamMembersContent
                {...membersState}
                team={team}
                colorIndex={colorIndex}
                pageSize={pageSize}
            />
        </div>
    );
}
