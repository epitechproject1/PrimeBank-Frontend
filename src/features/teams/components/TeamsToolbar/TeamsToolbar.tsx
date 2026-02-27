import React from "react";
import { Input, Button, Select, Space, Tooltip, Typography } from "antd";
import type { InputProps } from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    DownloadOutlined,
    FilePdfOutlined,
    UploadOutlined,
} from "@ant-design/icons";
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

    canExport?: boolean;
    canImport?: boolean;
    onExportCsv?: () => void;
    onExportPdf?: () => void;
    onOpenImport?: () => void;
}

const H = 38;
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

const inputStyle: React.CSSProperties = {
    height: H,
    borderRadius: 8,
    fontSize: 14,
};

const iconBtnStyle: React.CSSProperties = {
    height: H,
    width: H,
    borderRadius: 8,
    flexShrink: 0,
};

function SearchBlock({
                         search,
                         onSearchChange,
                         onSearchClear,
                     }: {
    search: string;
    onSearchChange: (v: string) => void;
    onSearchClear: () => void;
}) {
    const handleInputChange: InputProps["onChange"] = (e) => {
        const v = e.target.value;
        onSearchChange(v);
        if (v.trim() === "") onSearchClear();
    };

    return (
        <div style={{ flex: 1, minWidth: 0 }}>
            <Input
                value={search}
                onChange={handleInputChange}
                allowClear
                placeholder="Rechercher une équipe..."
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                style={inputStyle}
            />
        </div>
    );
}

function OrderingBlock({
                           ordering,
                           onOrderingChange,
                       }: {
    ordering: TeamFilters["ordering"];
    onOrderingChange: (v: TeamFilters["ordering"]) => void;
}) {
    const selectedOrdering = (ordering ?? DEFAULT_ORDERING) as NonNullable<TeamFilters["ordering"]>;

    return (
        <Select
            value={selectedOrdering}
            onChange={onOrderingChange}
            style={{ width: 180, height: H, flexShrink: 0 }}
            options={ORDERING_OPTIONS}
        />
    );
}

function ActionsBlock({
                          loading,
                          onRefresh,
                          canExport,
                          canImport,
                          onExportCsv,
                          onExportPdf,
                          onOpenImport,
                      }: {
    loading: boolean;
    onRefresh: () => void;
    canExport: boolean;
    canImport: boolean;
    onExportCsv?: () => void;
    onExportPdf?: () => void;
    onOpenImport?: () => void;
}) {
    return (
        <>
            <Tooltip title="Rafraîchir">
                <Button onClick={onRefresh} loading={loading} icon={<ReloadOutlined />} style={iconBtnStyle} />
            </Tooltip>

            {canExport && (
                <Tooltip title="Exporter CSV">
                    <Button icon={<DownloadOutlined />} onClick={onExportCsv} style={iconBtnStyle} />
                </Tooltip>
            )}

            {canExport && (
                <Tooltip title="Exporter PDF">
                    <Button icon={<FilePdfOutlined />} onClick={onExportPdf} style={iconBtnStyle} />
                </Tooltip>
            )}

            {canImport && (
                <Tooltip title="Importer CSV">
                    <Button icon={<UploadOutlined />} onClick={onOpenImport} style={iconBtnStyle} />
                </Tooltip>
            )}
        </>
    );
}

function ViewModeBlock({
                           viewMode,
                           onViewModeChange,
                       }: {
    viewMode: "grid" | "list";
    onViewModeChange: (m: "grid" | "list") => void;
}) {
    return (
        <Space.Compact>
            <Button
                icon={<AppstoreOutlined />}
                type={viewMode === "grid" ? "primary" : "default"}
                onClick={() => onViewModeChange("grid")}
                style={{ height: H }}
            />
            <Button
                icon={<UnorderedListOutlined />}
                type={viewMode === "list" ? "primary" : "default"}
                onClick={() => onViewModeChange("list")}
                style={{ height: H }}
            />
        </Space.Compact>
    );
}

function SearchingHint({ searching }: { searching: boolean }) {
    if (!searching) return null;

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
                                 canExport = true,
                                 canImport = true,
                                 onExportCsv,
                                 onExportPdf,
                                 onOpenImport,
                             }: TeamsToolbarProps) {
    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <SearchBlock search={search} onSearchChange={onSearchChange} onSearchClear={onSearchClear} />

                <OrderingBlock ordering={ordering} onOrderingChange={onOrderingChange} />

                <ActionsBlock
                    loading={loading}
                    onRefresh={onRefresh}
                    canExport={canExport}
                    canImport={canImport}
                    onExportCsv={onExportCsv}
                    onExportPdf={onExportPdf}
                    onOpenImport={onOpenImport}
                />

                <ViewModeBlock viewMode={viewMode} onViewModeChange={onViewModeChange} />
            </div>

            <SearchingHint searching={searching} />
        </div>
    );
}