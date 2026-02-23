import { Row, Col } from "antd";
import type { TeamType } from "../types/teams.type.ts";
import { TeamGridCard } from "../components/TeamGrid/TeamGridCard.tsx";

interface TeamsGridViewProps {
    teams: TeamType[];
    onEdit: (team: TeamType) => void;
    onDelete: (id: number) => void;
    onView: (team: TeamType, index: number) => void;
}

export function TeamsGridView({ teams, onEdit, onDelete, onView }: TeamsGridViewProps) {
    return (
        <Row gutter={[16, 16]}>
            {teams.map((team, i) => (
                <Col key={team.id} xs={24} sm={12} lg={8} xl={8}>
                    <TeamGridCard
                        team={team}
                        index={i}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                    />
                </Col>
            ))}
        </Row>
    );
}
