import { Card, Col } from "antd";
import {TeamType} from "../types/teams.type.ts";
import {TeamsGridCardHeader} from "./card/TeamsGridCardHeader.tsx";
import {TeamsGridCardBody} from "./card/TeamsGridCardBody.tsx";
import {TeamsGridCardFooter} from "./card/TeamsGridCardFooter.tsx";


type Props = {
    team: TeamType;
    index: number;
    pinned?: boolean;

    onView: (team: TeamType, index: number) => void;
    canViewDetails: (team: TeamType) => boolean;

    onEdit?: (team: TeamType) => void;
    onDelete?: (id: number) => void;
};

function getInitials(name?: string) {
    const s = (name ?? "").trim();
    return s ? s.slice(0, 2).toUpperCase() : "--";
}

function getLeaderName(team: TeamType) {
    if (!team.owner) return "Non défini";
    const full = `${team.owner.first_name ?? ""} ${team.owner.last_name ?? ""}`.trim();
    return full || "Non défini";
}

export function TeamsGridCard({ team, index, pinned, onView, canViewDetails, onEdit, onDelete }: Props) {
    const name = team.name ?? "-";
    const initials = getInitials(name);
    const leaderName = getLeaderName(team);
    const membersCount = team.members_count ?? 0;

    const baseShadow = pinned ? "0 10px 26px rgba(22,119,255,0.10)" : "0 10px 26px rgba(0,0,0,0.06)";
    const hoverShadow = pinned ? "0 18px 52px rgba(22,119,255,0.15)" : "0 18px 52px rgba(0,0,0,0.10)";

    return (
        <Col xs={24} sm={12} lg={8}>
            <Card
                hoverable
                style={{
                    width: "100%",
                    borderRadius: 18,
                    overflow: "hidden",
                    border: pinned ? "1.5px solid rgba(22,119,255,0.35)" : "1px solid rgba(0,0,0,0.06)",
                    boxShadow: baseShadow,
                    transition: "all 220ms ease",
                    background: "rgba(255,255,255,0.92)",
                    height: "100%",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = hoverShadow;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = baseShadow;
                }}
                styles={{ body: { padding: 0 } }}
                onClick={() => onView(team, index)}
            >
                <TeamsGridCardHeader
                    team={team}
                    index={index}
                    pinned={pinned}
                    name={name}
                    initials={initials}
                    onView={onView}
                    canViewDetails={canViewDetails}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />

                <TeamsGridCardBody team={team} />

                <TeamsGridCardFooter
                    team={team}
                    index={index}
                    leaderName={leaderName}
                    membersCount={membersCount}
                    onView={onView}
                />
            </Card>
        </Col>
    );
}