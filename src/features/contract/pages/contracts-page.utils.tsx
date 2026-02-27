/* eslint-disable react-refresh/only-export-components */
import { Button, Card, Col, Flex, Input, Row, Select, Space, Statistic, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import type { Contract } from "../types/contract.types";

export type StatusFilter = "all" | "active" | "expiring_soon" | "expired";

const EXPIRING_SOON_DAYS = 30;

export function getContractStatus(contract: Contract): StatusFilter {
    if (!contract.end_date) return "active";

    const today = new Date();
    const endDate = new Date(contract.end_date);
    if (endDate < today) return "expired";

    const diff = endDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return daysLeft <= EXPIRING_SOON_DAYS ? "expiring_soon" : "active";
}

function formatDate(date?: string | null) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
}

function userLabel(contract: Contract) {
    const firstName = contract.user_detail?.first_name ?? "";
    const lastName = contract.user_detail?.last_name ?? "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || `User #${contract.user}`;
}

function StatusTag({ contract }: { contract: Contract }) {
    const status = getContractStatus(contract);
    if (status === "expired") return <Tag color="error">Expire</Tag>;
    if (status === "expiring_soon") return <Tag color="warning">Bientot expire</Tag>;
    return <Tag color="success">En cours</Tag>;
}

export function getColumns(): ColumnsType<Contract> {
    return [
        {
            title: "Utilisateur",
            key: "user",
            render: (_, record) => (
                <div>
                    <div>{userLabel(record)}</div>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {record.user_detail?.email ?? "-"}
                    </Typography.Text>
                </div>
            ),
        },
        {
            title: "Type",
            key: "type",
            render: (_, record) =>
                record.contract_type_detail?.name ?? `Type #${record.contract_type}`,
        },
        {
            title: "Date debut",
            dataIndex: "start_date",
            key: "start_date",
            render: (value: string) => formatDate(value),
        },
        {
            title: "Date fin",
            dataIndex: "end_date",
            key: "end_date",
            render: (value?: string | null) => formatDate(value),
        },
        {
            title: "Heures/sem",
            dataIndex: "weekly_hours_target",
            key: "weekly_hours_target",
            render: (value?: number | string | null) => value ?? "-",
        },
        {
            title: "Statut",
            key: "status",
            render: (_, record) => <StatusTag contract={record} />,
        },
    ];
}

export function computeStats(contracts: Contract[]) {
    const expired = contracts.filter((c) => getContractStatus(c) === "expired").length;
    const expiringSoon = contracts.filter(
        (c) => getContractStatus(c) === "expiring_soon"
    ).length;
    const active = contracts.filter((c) => getContractStatus(c) === "active").length;
    return { total: contracts.length, active, expiringSoon, expired };
}

export function filterContracts(
    contracts: Contract[],
    statusFilter: StatusFilter,
    typeFilter: number | "all",
    search: string
) {
    const query = search.trim().toLowerCase();
    return contracts.filter((contract) => {
        const status = getContractStatus(contract);
        if (statusFilter !== "all" && status !== statusFilter) return false;
        if (typeFilter !== "all" && contract.contract_type !== typeFilter) return false;
        if (!query) return true;

        const uLabel = userLabel(contract).toLowerCase();
        const email = contract.user_detail?.email?.toLowerCase() ?? "";
        const typeName = contract.contract_type_detail?.name?.toLowerCase() ?? "";
        return uLabel.includes(query) || email.includes(query) || typeName.includes(query);
    });
}

export function ContractsHeader({
    onRefresh,
    onCreate,
    onCreateType,
}: {
    onRefresh: () => void;
    onCreate: () => void;
    onCreateType: () => void;
}) {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                background: token.colorBgContainer,
                padding: "16px 24px",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
            }}
        >
            <div>
                <Typography.Title level={5} style={{ margin: 0 }}>
                    Gestion des contrats
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    Suivi des contrats en cours, bientot expires et expires
                </Typography.Text>
            </div>
            <Space>
                <Button icon={<ReloadOutlined />} onClick={onRefresh}>
                    Rafraichir
                </Button>
                <Button onClick={onCreateType}>Nouveau type</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                    Nouveau contrat
                </Button>
            </Space>
        </div>
    );
}

export function ContractsStatsCards({
    total,
    active,
    expiringSoon,
    expired,
}: {
    total: number;
    active: number;
    expiringSoon: number;
    expired: number;
}) {
    return (
        <Row gutter={12}>
            <Col span={6}>
                <Card>
                    <Statistic title="Total contrats" value={total} />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic title="En cours" value={active} />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic title="Bientot expires" value={expiringSoon} />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic title="Expires" value={expired} />
                </Card>
            </Col>
        </Row>
    );
}

export function ContractsFilters({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    typeOptions,
}: {
    search: string;
    setSearch: (value: string) => void;
    statusFilter: StatusFilter;
    setStatusFilter: (value: StatusFilter) => void;
    typeFilter: number | "all";
    setTypeFilter: (value: number | "all") => void;
    typeOptions: { value: number | "all"; label: string }[];
}) {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                padding: "12px 24px",
                background: token.colorBgContainer,
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
            }}
        >
            <Flex gap={12} wrap>
                <Input
                    prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
                    allowClear
                    placeholder="Rechercher utilisateur/email/type..."
                    style={{ width: 320 }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Select<StatusFilter>
                    value={statusFilter}
                    style={{ width: 220 }}
                    onChange={setStatusFilter}
                    options={[
                        { value: "all", label: "Tous les statuts" },
                        { value: "active", label: "En cours" },
                        { value: "expiring_soon", label: "Bientot expires" },
                        { value: "expired", label: "Expires" },
                    ]}
                />
                <Select<number | "all">
                    value={typeFilter}
                    style={{ width: 260 }}
                    onChange={setTypeFilter}
                    options={typeOptions}
                />
            </Flex>
        </div>
    );
}
