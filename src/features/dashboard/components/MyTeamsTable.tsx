import { Card, Table, Tag, Typography } from "antd";
import type { TeamType } from "../../teams/types/teams.type";

const { Text } = Typography;

const columns = [
    {
        title: "Équipe",
        dataIndex: "name",
        key: "name",
        render: (name: string) => <Text strong>{name}</Text>,
    },
    {
        title: "Département",
        key: "department",
        render: (_: unknown, t: TeamType) =>
            t.department?.name ? (
                <Tag style={{ borderRadius: 8 }}>{t.department.name}</Tag>
            ) : (
                <Text type="secondary">—</Text>
            ),
    },
    {
        title: "Membres",
        dataIndex: "members_count",
        key: "members_count",
        render: (v: number) => (
            <Tag color="purple" style={{ borderRadius: 8 }}>
                {v}
            </Tag>
        ),
    },
    {
        title: "Responsable",
        key: "owner",
        render: (_: unknown, t: TeamType) =>
            t.owner ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: 10,
                            fontWeight: 700,
                            flexShrink: 0,
                        }}
                    >
                        {t.owner.first_name[0]}
                        {t.owner.last_name[0]}
                    </div>
                    <Text>{`${t.owner.first_name} ${t.owner.last_name}`}</Text>
                </div>
            ) : (
                <Text type="secondary">—</Text>
            ),
    },
];

interface MyTeamsTableProps {
    data: TeamType[];
    loading: boolean;
    cardStyle: React.CSSProperties;
}

export function MyTeamsTable({ data, loading, cardStyle }: MyTeamsTableProps) {
    return (
        <Card
            title={<Text strong style={{ fontSize: 15 }}>Mes équipes (owner)</Text>}
            extra={
                <Tag color="purple" style={{ borderRadius: 8 }}>
                    {data.length} équipe{data.length > 1 ? "s" : ""}
                </Tag>
            }
            loading={loading}
            style={cardStyle}
        >
            <Table<TeamType>
                rowKey="id"
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 6, size: "small" }}
                size="small"
                locale={{ emptyText: "Aucune équipe sous votre responsabilité" }}
            />
        </Card>
    );
}