import { Row } from "antd";
import type { TeamType } from "../types/teams.type";
import { TeamsGridCard } from "./TeamsGridCard.tsx";

type Props = {
    teams: TeamType[];
    onView: (team: TeamType, index: number) => void;
    canViewDetails: (team: TeamType) => boolean;
    onEdit?: (team: TeamType) => void;
    onDelete?: (id: number) => void;
    pinned?: boolean;
};

export function TeamsGridView({ teams, onView, canViewDetails, onEdit, onDelete, pinned }: Props) {
    return (
        <Row gutter={[20, 20]}>
            {teams.map((team, index) => (
                <TeamsGridCard
                    key={team.id}
                    team={team}
                    index={index}
                    pinned={pinned}
                    onView={onView}
                    canViewDetails={canViewDetails}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </Row>
    );
}