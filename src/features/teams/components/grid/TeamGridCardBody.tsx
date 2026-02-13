import { Button, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { TeamType } from "../../types/teams.type";
import { TeamGridCardStats } from "./TeamGridCardStats";

const { Text } = Typography;

type Props = {
    team: TeamType;
    index: number;
    onView: (team: TeamType, index: number) => void;
};

export function TeamGridCardBody({ team, index, onView }: Props) {
    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        onView(team, index);
    };

    return (
        <div style={{ padding: "20px 24px 24px" }}>
            {team.description ? (
                <Text
                    type="secondary"
                    style={{
                        fontSize: 13,
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        marginBottom: 20,
                        minHeight: 42,
                    }}
                >
                    {team.description}
                </Text>
            ) : (
                <Text
                    type="secondary"
                    style={{
                        fontSize: 13,
                        fontStyle: "italic",
                        display: "block",
                        marginBottom: 20,
                        minHeight: 42,
                    }}
                >
                    Aucune description
                </Text>
            )}

            <TeamGridCardStats team={team} />

            <Button
                type="link"
                block
                icon={<EyeOutlined />}
                onClick={handleView}
                style={{ marginTop: 16, height: 36, fontWeight: 500, borderRadius: 8 }}
            >
                Voir les détails
            </Button>
        </div>
    );
}
