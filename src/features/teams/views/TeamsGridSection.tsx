import { Typography, theme } from "antd";
import { PushpinFilled } from "@ant-design/icons";

import type { TeamType } from "../types/teams.type";
import { TeamsGridView } from "./TeamsGridView";

const { Title } = Typography;
const { useToken } = theme;

type Props = {
    teams: TeamType[];
    onView: (team: TeamType, index: number) => void;
    onEdit?: (team: TeamType) => void;
    onDelete?: (id: number) => void;
    canViewDetails: (team: TeamType) => boolean;
};

export function TeamsGridSection({ teams, onView, onEdit, onDelete, canViewDetails }: Props) {
    const { token } = useToken();

    const pinned = teams.filter((t) => (t.is_pinned ?? 0) === 1);
    const others = teams.filter((t) => (t.is_pinned ?? 0) !== 1);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {pinned.length > 0 && (
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <PushpinFilled style={{ color: token.colorPrimary, fontSize: 16 }} />
                        <Title level={5} style={{ margin: 0, color: token.colorPrimary }}>
                            Mes équipes
                        </Title>
                        <span
                            style={{
                                background: token.colorPrimaryBg,
                                color: token.colorPrimary,
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
                            <Title level={5} style={{ margin: 0, color: token.colorTextSecondary }}>
                                Toutes les équipes
                            </Title>
                            <span
                                style={{
                                    background: token.colorFillSecondary,
                                    color: token.colorTextSecondary,
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