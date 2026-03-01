import { Card, Table, Tag, Typography } from "antd";
import type { DepartmentStatsBreakdownRow } from "../../departments/types/departments.type";

const { Text } = Typography;

const columns = [
    {
        title: "Département",
        dataIndex: "name",
        key: "name",
        render: (name: string) => <Text strong>{name}</Text>,
    },
    {
        title: "Équipes",
        dataIndex: "teams_count",
        key: "teams_count",
        render: (v: number) => (
            <Tag color="blue" style={{ borderRadius: 8 }}>
                {v}
            </Tag>
        ),
    },
    {
        title: "Employés",
        dataIndex: "members_count",
        key: "members_count",
        render: (v: number) => (
            <Tag color="green" style={{ borderRadius: 8 }}>
                {v}
            </Tag>
        ),
    },
];

interface DepartmentBreakdownTableProps {
    data: DepartmentStatsBreakdownRow[];
    loading: boolean;
    cardStyle: React.CSSProperties;
}

export function DepartmentBreakdownTable({
                                             data,
                                             loading,
                                             cardStyle,
                                         }: DepartmentBreakdownTableProps) {
    return (
        <Card
            title={<Text strong style={{ fontSize: 15 }}>Détail par département</Text>}
            extra={
                <Tag color="blue" style={{ borderRadius: 8 }}>
                    {data.length} depts
                </Tag>
            }
            loading={loading}
            style={cardStyle}
        >
            <Table<DepartmentStatsBreakdownRow>
                rowKey="id"
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 8, size: "small" }}
                size="small"
            />
        </Card>
    );
}