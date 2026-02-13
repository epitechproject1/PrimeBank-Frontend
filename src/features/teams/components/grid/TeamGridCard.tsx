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
            style={{
                width,
                borderRadius: 16,
                boxShadow:
                    "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
                border: "1px solid #f0f0f0",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
            }}
            styles={{ body: { padding: 0 } }}
            hoverable
            onClick={() => onView(team, index)}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px 0 rgba(0, 0, 0, 0.12)";
                e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                    "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            <TeamGridCardHeader team={team} index={index} onEdit={onEdit} onDelete={onDelete} onView={onView} />
            <TeamGridCardBody team={team} index={index} onView={onView} />
        </Card>
    );
}
