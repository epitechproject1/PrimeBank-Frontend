import type { ColumnsType } from "antd/es/table";
import type { TeamType } from "../types/teams.type";
import { formatDate } from "./teams-constants";
import { Typography } from "antd";
import {
    ActionsCell,
    DepartmentCell,
    DescriptionCell,
    MembersCountCell,
    OwnerCell,
    TeamNameCell,
    type TeamsTableHandlers,
} from "./TeamsTableCells";

const { Text } = Typography;

export function getTeamsTableColumns(
    onEdit: (team: TeamType) => void,
    onDelete: (id: number) => void,
    onView: (team: TeamType, index: number) => void,
    saving: boolean
): ColumnsType<TeamType> {
    const handlers: TeamsTableHandlers = { onEdit, onDelete, onView, saving };

    return [
        {
            title: "Équipe",
            dataIndex: "name",
            key: "name",
            fixed: "left",
            width: 250,
            render: (name: string, team: TeamType, index: number) => <TeamNameCell name={name} team={team} index={index} />,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 300,
            ellipsis: { showTitle: false },
            render: (desc: string | null) => <DescriptionCell desc={desc} />,
        },
        {
            title: "Département",
            dataIndex: "department",
            key: "department",
            width: 180,
            render: (dept: TeamType["department"], _team: TeamType, index: number) => <DepartmentCell dept={dept} index={index} />,
        },
        {
            title: "Responsable",
            dataIndex: "owner",
            key: "owner",
            width: 200,
            render: (owner: TeamType["owner"]) => <OwnerCell owner={owner} />,
        },
        {
            title: "Membres",
            key: "members_count",
            width: 100,
            align: "center",
            render: (_: unknown, team: TeamType) => <MembersCountCell team={team} />,
        },
        {
            title: "Créé le",
            dataIndex: "created_at",
            key: "created_at",
            width: 130,
            render: (date: string) => (
                <Text type="secondary" style={{ fontSize: 13 }}>
                    {formatDate(date)}
                </Text>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            align: "right",
            fixed: "right",
            width: 140,
            render: (_: unknown, team: TeamType, index: number) => <ActionsCell team={team} index={index} handlers={handlers} />,
        },
    ];
}
