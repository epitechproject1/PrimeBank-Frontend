import { Descriptions, Typography, Space } from "antd";
import { BankOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { TeamType } from "../../types/teams.type";
import { formatDate } from "../../utils/teams-constants";

const { Text } = Typography;

interface Props {
    team: TeamType;
}

export function TeamDetailsInfo({ team }: Props) {
    return (
        <Descriptions
            title={<Text strong>Informations de l’équipe</Text>}
            bordered
            column={1}
            size="small"
            style={{ marginBottom: 18, borderRadius: 14, overflow: "hidden" }}
            labelStyle={{ width: 220 }}
        >
            <Descriptions.Item label={<Space><CalendarOutlined /> Date de création</Space>}>
                {formatDate(team.created_at)}
            </Descriptions.Item>

            <Descriptions.Item label={<Space><ClockCircleOutlined /> Dernière modification</Space>}>
                {formatDate(team.updated_at)}
            </Descriptions.Item>

            {team.department && (
                <Descriptions.Item label={<Space><BankOutlined /> Département</Space>}>
                    {team.department.name ?? `Département #${team.department.id}`}
                </Descriptions.Item>
            )}
        </Descriptions>
    );
}
