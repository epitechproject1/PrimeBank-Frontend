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
        <div>
            <div style={{ padding: 16, minHeight: 72 }}>
                <Text type={team.description ? undefined : "secondary"}>
                    {team.description || "Aucune description."}
                </Text>
            </div>

            <div style={{ padding: "0 16px 16px" }}>
                <TeamGridCardStats team={team} />

                <div style={{ marginTop: 12, textAlign: "center" }}>
                    <Button type="link" icon={<EyeOutlined />} onClick={handleView}>
                        Voir les détails
                    </Button>
                </div>
            </div>
        </div>
    );
}
