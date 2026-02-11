import { useState, useEffect, useCallback } from "react";
import {
    Flex,
    Grid,
    Typography,
    Button,
    Input,
    Card,
    Table,
    Statistic,
    Tag,
    Space,
    Tooltip,
    Empty,
    Spin,
    theme,
    Popconfirm,
    message,
    Avatar,
} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    TeamOutlined,
    BankOutlined,
    CalendarOutlined,
    ReloadOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { teamService } from "../services/teams.service.ts";
import { TeamType } from "../types/teams.type.ts";
import TeamFormModal from "../components/teamFormModal.tsx";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;


const AVATAR_COLORS = ["#1677ff", "#7c3aed", "#0891b2", "#16a34a", "#ea580c", "#db2777"];
const TAG_COLORS = ["blue", "purple", "cyan", "green", "orange", "magenta"];

function formatDate(dateStr: string) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}


export function TeamsPage() {
    const screens = useBreakpoint();
    const { token } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();

    const [teams, setTeams] = useState<TeamType[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [modalOpen, setModalOpen] = useState(false);
    const [editTeam, setEditTeam] = useState<TeamType | null>(null);


    const fetchTeams = useCallback(async () => {
        setLoading(true);
        try {
            const data = await teamService.getAll();
            setTeams(data);
        } catch (err: any) {
            messageApi.error(err?.message ?? "Erreur lors du chargement");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);


    const openAdd = () => {
        setEditTeam(null);
        setModalOpen(true);
    };

    const openEdit = (team: TeamType) => {
        setEditTeam(team);
        setModalOpen(true);
    };

    const handleSaved = (team: TeamType) => {
        if (editTeam) {
            setTeams((prev) => prev.map((t) => (t.id === team.id ? team : t)));
        } else {
            setTeams((prev) => [...prev, team]);
        }
    };

    const handleDelete = async (id: number) => {
        setSaving(true);
        try {
            await teamService.delete(id);
            setTeams((prev) => prev.filter((t) => t.id !== id));
            messageApi.success("Équipe supprimée");
        } catch (err: any) {
            messageApi.error(err?.message ?? "Erreur lors de la suppression");
        } finally {
            setSaving(false);
        }
    };


    const filtered = teams.filter(
        (t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            (t.description ?? "").toLowerCase().includes(search.toLowerCase())
    );


    const deptCount = new Set(teams.map((t) => t.department?.id).filter(Boolean)).size;
    const thisMonth = teams.filter(
        (t) => new Date(t.created_at).getMonth() === new Date().getMonth()
    ).length;


    const columns = [
        {
            title: "Équipe",
            dataIndex: "name",
            key: "name",
            render: (name: string, _: TeamType, i: number) => (
                <Space>
                    <Avatar
                        size={36}
                        style={{
                            backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                            fontWeight: 700,
                        }}
                    >
                        {getInitials(name)}
                    </Avatar>
                    <Text strong>{name}</Text>
                </Space>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (desc: string) => (
                <Text type="secondary" ellipsis style={{ maxWidth: 280 }}>
                    {desc || "—"}
                </Text>
            ),
        },
        {
            title: "Département",
            dataIndex: "department",
            key: "department",
            render: (dept: TeamType["department"], _: TeamType, i: number) =>
                dept ? (
                    <Tag color={TAG_COLORS[i % TAG_COLORS.length]} icon={<BankOutlined />}>
                        {dept.name ?? `Dept #${dept.id}`}
                    </Tag>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "Responsable",
            dataIndex: "owner",
            key: "owner",
            render: (owner: TeamType["owner"]) =>
                owner ? (
                    <Space>
                        <Avatar size={24} icon={<UserOutlined />} />
                        <Text>{owner.first_name} {owner.last_name}</Text>
                    </Space>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "Créé le",
            dataIndex: "created_at",
            key: "created_at",
            render: (date: string) => <Text type="secondary">{formatDate(date)}</Text>,
        },
        {
            title: "Actions",
            key: "actions",
            align: "right" as const,
            render: (_: unknown, team: TeamType) => (
                <Space>
                    <Tooltip title="Modifier">
                        <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(team)} />
                    </Tooltip>
                    <Popconfirm
                        title="Supprimer cette équipe ?"
                        description="Cette action est irréversible."
                        okText="Supprimer"
                        cancelText="Annuler"
                        okButtonProps={{ danger: true, loading: saving }}
                        onConfirm={() => handleDelete(team.id!)}
                    >
                        <Tooltip title="Supprimer">
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    return (
        <>
            {contextHolder}

            <Flex
                vertical
                style={{
                    minHeight: "100vh",
                    padding: screens.md ? "32px 40px" : "16px",
                }}
            >
                {/* Header */}
                <Flex align="center" justify="space-between" style={{ marginBottom: 32 }}>
                    <Flex align="center" gap={12}>
                        <Avatar
                            size={48}
                            icon={<TeamOutlined />}
                            style={{ backgroundColor: token.colorPrimary }}
                        />
                        <div>
                            <Title level={3} style={{ margin: 0 }}>
                                Gestion des équipes
                            </Title>
                            <Text type="secondary">Time Manager — PrimeBank</Text>
                        </div>
                    </Flex>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={openAdd}
                    >
                        {screens.sm ? "Nouvelle équipe" : ""}
                    </Button>
                </Flex>

                {/* Stats */}
                <Flex gap={16} wrap="wrap" style={{ marginBottom: 32 }}>
                    {[
                        {
                            title: "Total équipes",
                            value: teams.length,
                            icon: <TeamOutlined />,
                            color: token.colorPrimary,
                        },
                        {
                            title: "Départements",
                            value: deptCount || 0,
                            icon: <BankOutlined />,
                            color: token.colorSuccess,
                        },
                        {
                            title: "Ce mois",
                            value: thisMonth,
                            icon: <CalendarOutlined />,
                            color: token.colorWarning,
                        },
                    ].map((stat, i) => (
                        <Card
                            key={i}
                            style={{ flex: 1, minWidth: 160 }}
                            styles={{ body: { padding: "20px 24px" } }}
                        >
                            <Flex align="center" gap={16}>
                                <Avatar
                                    size={44}
                                    icon={stat.icon}
                                    style={{
                                        backgroundColor: `${stat.color}22`,
                                        color: stat.color,
                                    }}
                                />
                                <Statistic
                                    title={stat.title}
                                    value={stat.value}
                                    valueStyle={{
                                        fontSize: 26,
                                        fontWeight: 800,
                                        color: stat.color,
                                    }}
                                />
                            </Flex>
                        </Card>
                    ))}
                </Flex>

                {/* Toolbar */}
                <Flex gap={12} style={{ marginBottom: 20 }} wrap="wrap">
                    <Input
                        prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />}
                        placeholder="Rechercher une équipe..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                        style={{ flex: 1, minWidth: 220 }}
                    />
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchTeams}
                        loading={loading}
                        title="Rafraîchir"
                    />
                    <Flex>
                        <Button
                            icon={<AppstoreOutlined />}
                            type={viewMode === "grid" ? "primary" : "default"}
                            onClick={() => setViewMode("grid")}
                            style={{ borderRadius: "6px 0 0 6px" }}
                        />
                        <Button
                            icon={<UnorderedListOutlined />}
                            type={viewMode === "list" ? "primary" : "default"}
                            onClick={() => setViewMode("list")}
                            style={{ borderRadius: "0 6px 6px 0", marginLeft: -1 }}
                        />
                    </Flex>
                </Flex>

                {/* Content */}
                <Spin spinning={loading}>
                    {!loading && filtered.length === 0 ? (
                        <Empty
                            description={
                                search ? "Aucune équipe trouvée" : "Aucune équipe pour l'instant"
                            }
                            style={{ marginTop: 64 }}
                        >
                            {!search && (
                                <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                                    Créer une équipe
                                </Button>
                            )}
                        </Empty>
                    ) : viewMode === "grid" ? (
                        <Flex gap={20} wrap="wrap">
                            {filtered.map((team, i) => (
                                <Card
                                    key={team.id}
                                    hoverable
                                    style={{
                                        width: screens.xl
                                            ? "calc(33% - 14px)"
                                            : screens.md
                                                ? "calc(50% - 10px)"
                                                : "100%",
                                    }}
                                    styles={{ body: { padding: 20 } }}
                                    actions={[
                                        <Tooltip title="Modifier" key="edit">
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={() => openEdit(team)}
                                            />
                                        </Tooltip>,
                                        <Popconfirm
                                            key="delete"
                                            title="Supprimer cette équipe ?"
                                            description="Cette action est irréversible."
                                            okText="Supprimer"
                                            cancelText="Annuler"
                                            okButtonProps={{ danger: true }}
                                            onConfirm={() => handleDelete(team.id!)}
                                        >
                                            <Button type="text" danger icon={<DeleteOutlined />} />
                                        </Popconfirm>,
                                    ]}
                                >
                                    <Flex gap={12} align="flex-start">
                                        <Avatar
                                            size={48}
                                            style={{
                                                backgroundColor:
                                                    AVATAR_COLORS[i % AVATAR_COLORS.length],
                                                fontWeight: 700,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {getInitials(team.name)}
                                        </Avatar>
                                        <Flex vertical style={{ minWidth: 0 }}>
                                            <Text strong style={{ fontSize: 15 }}>
                                                {team.name}
                                            </Text>
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 13,
                                                    overflow: "hidden",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                }}
                                            >
                                                {team.description || "Pas de description"}
                                            </Text>
                                            <Flex gap={8} style={{ marginTop: 10 }} wrap="wrap" align="center">
                                                {team.department && (
                                                    <Tag
                                                        color={TAG_COLORS[i % TAG_COLORS.length]}
                                                        icon={<BankOutlined />}
                                                    >
                                                        {team.department.name ?? `Dept #${team.department.id}`}
                                                    </Tag>
                                                )}
                                                {team.owner && (
                                                    <Tag icon={<UserOutlined />}>
                                                        {team.owner.first_name} {team.owner.last_name}
                                                    </Tag>
                                                )}
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    <CalendarOutlined /> {formatDate(team.created_at)}
                                                </Text>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </Card>
                            ))}
                        </Flex>
                    ) : (
                        <Table<TeamType>
                            dataSource={filtered}
                            columns={columns}
                            rowKey="id"
                            pagination={{ pageSize: 10, showSizeChanger: false }}
                            locale={{ emptyText: <Empty description="Aucune équipe" /> }}
                            scroll={{ x: true }}
                        />
                    )}
                </Spin>
            </Flex>

            <TeamFormModal
                open={modalOpen}
                editTeam={editTeam}
                onClose={() => setModalOpen(false)}
                onSaved={handleSaved}
            />
        </>
    );
}

export default TeamsPage;