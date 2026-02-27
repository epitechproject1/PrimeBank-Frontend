import { Typography } from "antd";
import type { TeamType } from "../../types/teams.type";

const { Text } = Typography;

type Props = { team: TeamType };

export function TeamsGridCardBody({ team }: Props) {
    return (
        <div style={{ padding: 16, minHeight: 56 }}>
            <Text type={team.description ? undefined : "secondary"}>
                {team.description || "Aucune description."}
            </Text>
        </div>
    );
}