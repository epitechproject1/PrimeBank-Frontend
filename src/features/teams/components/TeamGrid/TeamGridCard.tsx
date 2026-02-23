import { Card } from "antd";
import type { TeamType } from "../../types/teams.type";
import { TeamGridCardHeader } from "./TeamGridCardHeader";
import { TeamGridCardBody } from "./TeamGridCardBody";

type Props = {
    team: TeamType;
    index: number;
    onEdit: (team: TeamType) => void;
    onDelete: (id: number) => void;
    onView: (team: TeamType, index: number) => void;
};

export function TeamGridCard({ team, index, onEdit, onDelete, onView }: Props) {
    return (
        <Card
            hoverable
            style={{
                width: "100%",
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
                transition: "all 220ms ease",
                background: "rgba(255,255,255,0.92)",
            }}
            styles={{ body: { padding: 0 } }}
            onClick={() => onView(team, index)}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 18px 52px rgba(0,0,0,0.10)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 26px rgba(0,0,0,0.06)";
            }}
        >
            <TeamGridCardHeader team={team} index={index} onEdit={onEdit} onDelete={onDelete} onView={onView} />
            <TeamGridCardBody team={team} index={index} onView={onView} />
        </Card>
    );
}
