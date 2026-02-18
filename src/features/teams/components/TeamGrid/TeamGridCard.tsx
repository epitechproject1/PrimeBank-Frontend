import { Card } from "antd";
import type { TeamType } from "../../types/teams.type";
import { TeamGridCardHeader } from "./TeamGridCardHeader";
import { TeamGridCardBody } from "./TeamGridCardBody";

type Props = {
    team: TeamType;
    index: number;
    width: string;
    onEdit: (team: TeamType) => void;
    onDelete: (id: number) => void;
    onView: (team: TeamType, index: number) => void;
};

export function TeamGridCard({ team, index, width, onEdit, onDelete, onView }: Props) {
    return (
        <Card
            className="team-card"
            style={{ width }}
            styles={{ body: { padding: 0 } }}
            hoverable
            onClick={() => onView(team, index)}
        >
            <TeamGridCardHeader team={team} index={index} onEdit={onEdit} onDelete={onDelete} onView={onView} />
            <TeamGridCardBody team={team} index={index} onView={onView} />
        </Card>
    );
}
