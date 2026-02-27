import { Card, Col } from "antd";
import type { TeamType } from "../types/teams.type";

import { TeamsGridCardHeader } from "./card/TeamsGridCardHeader";
import { TeamsGridCardBody } from "./card/TeamsGridCardBody";
import { TeamsGridCardFooter } from "./card/TeamsGridCardFooter";

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
    const s = (name ?? "").trim().replace(/\s+/g, " ");
    if (!s) return "--";

    const parts = s.split(" ").filter(Boolean);
    const a = parts[0]?.[0] ?? "";
    const b = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
    return (a + b).toUpperCase().padEnd(2, "•");
}

function getLeaderName(team: TeamType) {
    if (!team.owner) return "Non défini";
    const full = `${team.owner.first_name ?? ""} ${team.owner.last_name ?? ""}`.trim();
    return full || "Non défini";
}

export function TeamsGridCard({ team, index, pinned, onView, canViewDetails, onEdit, onDelete }: Props) {
    const name = (team.name ?? "").trim() || "-";
    const initials = getInitials(name);
    const leaderName = getLeaderName(team);
    const membersCount = team.members_count ?? 0;

    const canOpen = canViewDetails(team);

    const baseShadow = pinned ? "0 10px 26px rgba(22,119,255,0.10)" : "0 10px 26px rgba(0,0,0,0.06)";
    const hoverShadow = pinned ? "0 18px 52px rgba(22,119,255,0.15)" : "0 18px 52px rgba(0,0,0,0.10)";

    return (
        <Col xs={24} sm={12} lg={8}>
            <Card
                hoverable
                className="tm-team-card"
                style={{
                    width: "100%",
                    borderRadius: 18,
                    overflow: "hidden",
                    border: pinned ? "1.5px solid rgba(22,119,255,0.35)" : "1px solid rgba(0,0,0,0.06)",
                    boxShadow: baseShadow,
                    transition: "all 220ms ease",
                    background: "rgba(255,255,255,0.92)",
                    height: "100%",
                    cursor: canOpen ? "pointer" : "default",
                    opacity: canOpen ? 1 : 0.92,
                }}
                styles={{ body: { padding: 0 } }}
                onClick={() => {
                    if (canOpen) onView(team, index);
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = hoverShadow;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = baseShadow;
                }}
            >
                <TeamsGridCardHeader
                    team={team}
                    pinned={pinned}
                    initials={initials}
                    name={name}
                    canOpen={canOpen}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />

                <TeamsGridCardBody team={team} />

                <TeamsGridCardFooter leaderName={leaderName} membersCount={membersCount} />
            </Card>
        </Col>
    );
}