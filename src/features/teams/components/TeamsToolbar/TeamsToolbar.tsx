import { Flex, Input, Button, Select, Space, Tooltip, Typography } from "antd";
import { SearchOutlined, ReloadOutlined, AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import type { TeamFilters } from "../../types/teams.type";

const { Text } = Typography;

interface TeamsToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    onSearchClear: () => void;
    onRefresh: () => void;
    loading: boolean;
    searching: boolean;
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;

    ordering: TeamFilters["ordering"];
    onOrderingChange: (v: TeamFilters["ordering"]) => void;
}

const DEFAULT_ORDERING: NonNullable<TeamFilters["ordering"]> = "-created_at";

const WRAPPER_STYLE: React.CSSProperties = {
    position: "sticky",
    top: 12,
    zIndex: 20,
    marginBottom: 18,
    borderRadius: 16,
    padding: 12,
    background: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(0,0,0,0.06)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
};

const INPUT_STYLE: React.CSSProperties = {
    height: 42,
    borderRadius: 14,
    paddingLeft: 10,
    background: "rgba(250,250,250,0.9)",
    border: "1px solid rgba(0,0,0,0.06)",
};

const RIGHT_BOX_STYLE: React.CSSProperties = {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "6px 8px",
    borderRadius: 14,
    background: "rgba(250,250,250,0.85)",
    border: "1px solid rgba(0,0,0,0.06)",
};

const ICON_BTN_STYLE: React.CSSProperties = { height: 40, width: 40, borderRadius: 12 };

const ORDERING_OPTIONS: { value: NonNullable<TeamFilters["ordering"]>; label: string }[] = [
    { value: "-created_at", label: "Plus récentes" },
    { value: "created_at", label: "Plus anciennes" },
    { value: "name", label: "Nom (A → Z)" },
    { value: "-name", label: "Nom (Z → A)" },
    { value: "-members_count", label: "Plus de membres" },
    { value: "members_count", label: "Moins de membres" },
    { value: "-updated_at", label: "Modifiées récemment" },
    { value: "updated_at", label: "Modifiées anciennement" },
];

export function TeamsToolbar({
                                 search,
                                 onSearchChange,
                                 onSearchClear,
                                 onRefresh,
                                 loading,
                                 searching,
                                 viewMode,
                                 onViewModeChange,
                                 ordering,
                                 onOrderingChange,
                             }: TeamsToolbarProps) {
    const selectedOrdering = ordering ?? DEFAULT_ORDERING;

    return (
        <div style={WRAPPER_STYLE}>
            <Flex gap={12} wrap="wrap" align="center" justify="space-between">
                <div style={{ flex: 1, minWidth: 280 }}>
                    <Input
                        value={search}
                        onChange={(e) => {
                            const v = e.target.value;
                            onSearchChange(v);
                            if (v === "") onSearchClear();
                        }}
                        allowClear
                        placeholder="Rechercher une équipe…"
                        prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
                        style={INPUT_STYLE}
                    />

                    <div style={{ marginTop: 6, minHeight: 18 }}>
                        {searching ? (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Recherche en cours…
                            </Text>
                        ) : null}
                    </div>
                </div>

                <div style={RIGHT_BOX_STYLE}>
                    <Select<NonNullable<TeamFilters["ordering"]>>
                        value={selectedOrdering}
                        onChange={onOrderingChange}
                        style={{ width: 210 }}
                        variant="filled"
                        options={ORDERING_OPTIONS}
                    />

                    <Tooltip title="Rafraîchir">
                        <Button onClick={onRefresh} loading={loading} style={ICON_BTN_STYLE} icon={<ReloadOutlined />} />
                    </Tooltip>

                    <Space.Compact>
                        <Tooltip title="Vue grille">
                            <Button
                                icon={<AppstoreOutlined />}
                                type={viewMode === "grid" ? "primary" : "default"}
                                onClick={() => onViewModeChange("grid")}
                                style={ICON_BTN_STYLE}
                            />
                        </Tooltip>

                        <Tooltip title="Vue liste">
                            <Button
                                icon={<UnorderedListOutlined />}
                                type={viewMode === "list" ? "primary" : "default"}
                                onClick={() => onViewModeChange("list")}
                                style={ICON_BTN_STYLE}
                            />
                        </Tooltip>
                    </Space.Compact>
                </div>
            </Flex>
        </div>
    );
}
