import { Typography } from "antd";
import { PushpinFilled } from "@ant-design/icons";

import type { TeamType } from "../types/teams.type";
import { TeamsGridView } from "./TeamsGridView";

const { Title } = Typography;

type Props = {
    teams: TeamType[];
    onView: (team: TeamType, index: number) => void;
    onEdit?: (team: TeamType) => void;
    onDelete?: (id: number) => void;
    canViewDetails: (team: TeamType) => boolean;
};

export function TeamsGridSection({
                                     teams,
                                     onView,
                                     onEdit,
                                     onDelete,
                                     canViewDetails,
                                 }: Props) {
    const pinned = teams.filter((t) => (t.is_pinned ?? 0) === 1);
    const others = teams.filter((t) => (t.is_pinned ?? 0) !== 1);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {pinned.length > 0 && (
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <PushpinFilled style={{ color: "#1677ff", fontSize: 16 }} />
                        <Title level={5} style={{ margin: 0, color: "#1677ff" }}>
                            Mes équipes
                        </Title>
                        <span
                            style={{
                                background: "rgba(22,119,255,0.10)",
                                color: "#1677ff",
                                borderRadius: 20,
                                padding: "1px 10px",
                                fontSize: 13,
                                fontWeight: 600,
                            }}
                        >
              {pinned.length}
            </span>
                    </div>

                    <TeamsGridView
                        teams={pinned}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        canViewDetails={canViewDetails}
                        pinned
                    />
                </div>
            )}

            {others.length > 0 && (
                <div>
                    {pinned.length > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <Title level={5} style={{ margin: 0, color: "#595959" }}>
                                Toutes les équipes
                            </Title>
                            <span
                                style={{
                                    background: "rgba(0,0,0,0.06)",
                                    color: "#595959",
                                    borderRadius: 20,
                                    padding: "1px 10px",
                                    fontSize: 13,
                                    fontWeight: 600,
                                }}
                            >
                {others.length}
              </span>
                        </div>
                    )}

                    <TeamsGridView
                        teams={others}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        canViewDetails={canViewDetails}
                    />
                </div>
            )}
        </div>
    );
}