import { Flex, Input, Button, Select, Space, Tooltip, Typography } from "antd";
import type { InputProps } from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import type { TeamFilters } from "../../types/teams.type";

const { Text } = Typography;

//test

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

const H = 40;
const DEFAULT_ORDERING: NonNullable<TeamFilters["ordering"]> = "-created_at";

const ORDERING_OPTIONS: { value: NonNullable<TeamFilters["ordering"]>; label: string }[] = [
    { value: "-created_at", label: "Récent → Ancien" },
    { value: "created_at", label: "Ancien → Récent" },
    { value: "-updated_at", label: "Modifié récemment" },
    { value: "updated_at", label: "Modifié anciennement" },
    { value: "name", label: "Nom A → Z" },
    { value: "-name", label: "Nom Z → A" },
    { value: "-members_count", label: "Plus de membres" },
    { value: "members_count", label: "Moins de membres" },
];

const containerStyle: React.CSSProperties = {
    position: "sticky",
    top: 12,
    zIndex: 20,
    marginBottom: 18,
    borderRadius: 16,
    padding: "10px 14px",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(0,0,0,0.07)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
};

const dividerStyle: React.CSSProperties = {
    width: 1,
    height: 24,
    background: "rgba(0,0,0,0.08)",
    flexShrink: 0,
};

const inputStyle: React.CSSProperties = {
    height: H,
    borderRadius: 10,
    background: "#f8f8f8",
    border: "1px solid rgba(0,0,0,0.08)",
    fontSize: 14,
    boxShadow: "none",
};

const refreshBtnStyle: React.CSSProperties = {
    height: H,
    width: H,
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "#f8f8f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
};

function Divider() {
    return <div style={dividerStyle} />;
}

function SearchBox({
                       value,
                       onChangeValue,
                       onClear,
                   }: {
    value: string;
    onChangeValue: (v: string) => void;
    onClear: () => void;
}) {
    const handleChange: InputProps["onChange"] = (e) => {
        const v = e.target.value;
        onChangeValue(v);
        if (v.trim() === "") onClear();
    };

    return (
        <div style={{ flex: 1, minWidth: 0 }}>
            <Input
                value={value}
                onChange={handleChange}
                allowClear
                placeholder="Rechercher une équipe…"
                prefix={<SearchOutlined style={{ color: "#bfbfbf", fontSize: 15 }} />}
                style={inputStyle}
            />
        </div>
    );
}

function OrderingSelect({
                            value,
                            onChange,
                        }: {
    value: NonNullable<TeamFilters["ordering"]>;
    onChange: (v: TeamFilters["ordering"]) => void;
}) {
    return (
        <Select<NonNullable<TeamFilters["ordering"]>>
            value={value}
            onChange={onChange}
            style={{ width: 200, height: H, flexShrink: 0 }}
            styles={{ popup: { root: { borderRadius: 10 } } }}
            options={ORDERING_OPTIONS}
        />
    );
}

function RefreshButton({
                           onRefresh,
                           loading,
                       }: {
    onRefresh: () => void;
    loading: boolean;
}) {
    return (
        <Tooltip title="Rafraîchir">
            <Button
                onClick={onRefresh}
                loading={loading}
                icon={<ReloadOutlined />}
                style={refreshBtnStyle}
            />
        </Tooltip>
    );
}

function ViewModeToggle({
                            viewMode,
                            onChange,
                        }: {
    viewMode: "grid" | "list";
    onChange: (mode: "grid" | "list") => void;
}) {
    return (
        <Space.Compact style={{ flexShrink: 0 }}>
            <Tooltip title="Vue grille">
                <Button
                    icon={<AppstoreOutlined />}
                    type={viewMode === "grid" ? "primary" : "default"}
                    onClick={() => onChange("grid")}
                    style={{
                        height: H,
                        width: H,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px 0 0 10px",
                    }}
                />
            </Tooltip>
            <Tooltip title="Vue liste">
                <Button
                    icon={<UnorderedListOutlined />}
                    type={viewMode === "list" ? "primary" : "default"}
                    onClick={() => onChange("list")}
                    style={{
                        height: H,
                        width: H,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "0 10px 10px 0",
                    }}
                />
            </Tooltip>
        </Space.Compact>
    );
}

function SearchingHint({ show }: { show: boolean }) {
    if (!show) return null;
    return (
        <div style={{ marginTop: 6, paddingLeft: 2 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
                Recherche en cours…
            </Text>
        </div>
    );
}

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
    const selectedOrdering = (ordering ?? DEFAULT_ORDERING) as NonNullable<TeamFilters["ordering"]>;

    return (
        <div style={containerStyle}>
            <Flex gap={10} align="center" style={{ width: "100%" }}>
                <SearchBox value={search} onChangeValue={onSearchChange} onClear={onSearchClear} />
                <Divider />
                <OrderingSelect value={selectedOrdering} onChange={onOrderingChange} />
                <Divider />
                <RefreshButton onRefresh={onRefresh} loading={loading} />
                <ViewModeToggle viewMode={viewMode} onChange={onViewModeChange} />
            </Flex>

            <SearchingHint show={searching} />
        </div>
    );
}