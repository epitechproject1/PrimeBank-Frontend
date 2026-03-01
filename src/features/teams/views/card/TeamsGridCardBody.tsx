import { Typography, theme } from "antd";
import type { TeamType } from "../../types/teams.type";

const { Text } = Typography;
const { useToken } = theme;

type Props = { team: TeamType };

export function TeamsGridCardBody({ team }: Props) {
    const { token } = useToken();

    return (
        <div
            style={{
                padding: 16,
                minHeight: 56,
                background: token.colorBgContainer,
            }}
        >
            <Text type={team.description ? undefined : "secondary"}>
                {team.description || "Aucune description."}
            </Text>
        </div>
    );
}