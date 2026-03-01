/* eslint-disable react-refresh/only-export-components */
import {
    AppstoreOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    FileTextOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    WarningOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Col,
    Flex,
    Input,
    Row,
    Select,
    Space,
    Statistic,
    Tag,
    Typography,
    theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Contract, ContractSearchStats } from "../types/contract.types";

function statusTag(status?: Contract["status"]) {
    if (status === "expired") return <Tag color="error">Expire</Tag>;
    if (status === "expiring_soon") return <Tag color="warning">Bientot expire</Tag>;
    return <Tag color="success">En cours</Tag>;
}

function formatDate(value?: string | null) {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("fr-FR");
}

export function getColumns(onOpen: (contract: Contract) => void): ColumnsType<Contract> {
    return [
        {
            title: "Utilisateur",
            key: "user",
            render: (_, record) => (
                <div>
                    <div>
                        {record.user_detail?.first_name} {record.user_detail?.last_name}
                    </div>
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
            render: (_, record) => statusTag(record.status),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button size="small" onClick={() => onOpen(record)}>
                    Voir
                </Button>
            ),
        },
    ];
}

export function ContractsHeader({
    onRefresh,
    onCreate,
    onCreateType,
    viewMode,
    onViewModeChange,
    canManage = true,
}: {
    onRefresh: () => void;
    onCreate: () => void;
    onCreateType: () => void;
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    canManage?: boolean;
}) {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                padding: "16px 24px",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                background: token.colorBgContainer,
                borderRadius: token.borderRadiusLG,
            }}
        >
            <div>
                <Typography.Title level={5} style={{ margin: 0 }}>
                    Gestion des contrats
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    Vue carte/liste, recherche et actions sur chaque contrat
                </Typography.Text>
            </div>
            <Space>
                <Button icon={<ReloadOutlined />} onClick={onRefresh}>
                    Rafraichir
                </Button>
                {canManage && <Button onClick={onCreateType}>Nouveau type</Button>}
                {canManage && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                        Nouveau contrat
                    </Button>
                )}
                <Flex>
                    <Button
                        icon={<AppstoreOutlined />}
                        type={viewMode === "grid" ? "primary" : "default"}
                        onClick={() => onViewModeChange("grid")}
                        style={{ borderRadius: "6px 0 0 6px" }}
                    />
                    <Button
                        icon={<UnorderedListOutlined />}
                        type={viewMode === "list" ? "primary" : "default"}
                        onClick={() => onViewModeChange("list")}
                        style={{ borderRadius: "0 6px 6px 0", marginLeft: -1 }}
                    />
                </Flex>
            </Space>
        </div>
    );
}

export function ContractsStatsCards({ stats }: { stats: ContractSearchStats }) {
    const { token } = theme.useToken();

    const items = [
        {
            title: "Total contrats",
            value: stats.total,
            icon: <FileTextOutlined />,
            color: token.colorPrimary,
        },
        {
            title: "En cours",
            value: stats.active,
            icon: <CheckCircleOutlined />,
            color: token.colorSuccess,
        },
        {
            title: "Bientot expires",
            value: stats.expiring_soon,
            icon: <WarningOutlined />,
            color: token.colorWarning,
        },
        {
            title: "Expires",
            value: stats.expired,
            icon: <CalendarOutlined />,
            color: token.colorError,
        },
    ];

    return (
        <Row gutter={12}>
            {items.map((item) => (
                <Col key={item.title} xs={24} sm={12} lg={6}>
                    <Card styles={{ body: { padding: "20px 24px" } }}>
                        <Flex align="center" gap={16}>
                            <Avatar
                                size={44}
                                icon={item.icon}
                                style={{
                                    backgroundColor: `${item.color}22`,
                                    color: item.color,
                                }}
                            />
                            <Statistic
                                title={item.title}
                                value={item.value}
                                valueStyle={{
                                    fontSize: 24,
                                    fontWeight: 800,
                                    color: item.color,
                                }}
                            />
                        </Flex>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}

export function ContractsFilters({
    search,
    onSearchChange,
    status,
    onStatusChange,
    contractType,
    onContractTypeChange,
    pageSize,
    onPageSizeChange,
    typeOptions,
    canManage = true,
}: {
    search: string;
    onSearchChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    contractType: number | "all";
    onContractTypeChange: (value: number | "all") => void;
    pageSize: number;
    onPageSizeChange: (value: number) => void;
    typeOptions: { value: number | "all"; label: string }[];
    canManage?: boolean;
}) {
    const { token } = theme.useToken();
    const pageSizeOptions = [5, 10, 20, 50, 100, 150, 500].map((v) => ({
        value: v,
        label: `${v}`,
    }));

    return (
        <div
            style={{
                padding: "12px 24px",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorBgContainer,
                borderRadius: token.borderRadiusLG,
            }}
        >
            <Flex gap={12} wrap>
                <Input
                    prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />}
                    allowClear
                    placeholder="Rechercher utilisateur/email/type..."
                    style={{ width: 320 }}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <Select
                    value={status}
                    style={{ width: 220 }}
                    onChange={onStatusChange}
                    options={[
                        { value: "all", label: "Tous les statuts" },
                        { value: "active", label: "En cours" },
                        { value: "expiring_soon", label: "Bientot expires" },
                        { value: "expired", label: "Expires" },
                    ]}
                />
                {canManage && (
                    <Select<number | "all">
                        value={contractType}
                        style={{ width: 260 }}
                        onChange={onContractTypeChange}
                        options={typeOptions}
                    />
                )}
                <Select<number>
                    value={pageSize}
                    style={{ width: 120 }}
                    onChange={onPageSizeChange}
                    options={pageSizeOptions}
                />
            </Flex>
        </div>
    );
}
