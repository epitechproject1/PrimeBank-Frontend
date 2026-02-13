import { Flex } from "antd";
import type { TeamType } from "../types/teams.type";
import type { Screens } from "../utils/teams-grid.utils";
import { getGridCardWidth } from "../utils/teams-grid.utils";
import { TeamGridCard } from "./grid/TeamGridCard";

interface TeamsGridViewProps {
    teams: TeamType[];
    onEdit: (team: TeamType) => void;
    onDelete: (id: number) => void;
    onView: (team: TeamType, index: number) => void;
    screens: Screens;
}

export function TeamsGridView({ teams, onEdit, onDelete, onView, screens }: TeamsGridViewProps) {
    const width = getGridCardWidth(screens);

    return (
        <Flex gap={24} wrap="wrap">
            {teams.map((team, i) => (
                <TeamGridCard
                    key={team.id}
                    team={team}
                    index={i}
                    width={width}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                />
            ))}
        </Flex>
    );
}
