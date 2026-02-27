import React from "react";
import { Flex, Input, Button, Space, Tooltip, Typography, Select } from "antd";
import type { InputProps } from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";

import type { DepartmentOrdering } from "../../types/departments.type";
import { ExportCsvButton, ExportPdfButton, ImportCsvButton } from "./toolbar.actions";
import type { DeptFilters } from "./toolbar.utils";

const { Text } = Typography;

const ORDERING_OPTIONS: { label: string; value: DepartmentOrdering }[] = [
    { value: "-created_at", label: "Récent → Ancien" },
    { value: "created_at", label: "Ancien → Récent" },
    { value: "-updated_at", label: "Modifié récemment" },
    { value: "updated_at", label: "Modifié anciennement" },
    { value: "name", label: "Nom A → Z" },
    { value: "-name", label: "Nom Z → A" },
    { value: "-teams_count", label: "Plus d'équipes" },
    { value: "teams_count", label: "Moins d'équipes" },
    { value: "-employees_count", label: "Plus d'employés" },
    { value: "employees_count", label: "Moins d'employés" },
];

export interface DepartmentsToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    onSearchClear: () => void;
    onRefresh: () => void;
    loading: boolean;
    searching: boolean;
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    ordering: DepartmentOrdering;
    onOrderingChange: (ordering: DepartmentOrdering) => void;

    canExportCsv: boolean;
    canExportPdf: boolean;
    canImport: boolean;
}

const H = 40;

const toolbarContainerStyle: React.CSSProperties = {
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

const inputStyle: React.CSSProperties = {
    height: H,
    borderRadius: 10,
    background: "#f8f8f8",
    border: "1px solid rgba(0,0,0,0.08)",
    fontSize: 14,
    boxShadow: "none",
};

const squareBtnStyle: React.CSSProperties = {
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

const dividerStyle: React.CSSProperties = {
    width: 1,
    height: 24,
    background: "rgba(0,0,0,0.08)",
    flexShrink: 0,
};

function ToolbarContainer({ children }: { children: React.ReactNode }) {
    return <div style={toolbarContainerStyle}>{children}</div>;
}

function SearchInput({
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
                placeholder="Rechercher un département…"
                prefix={<SearchOutlined style={{ color: "#bfbfbf", fontSize: 15 }} />}
                allowClear={{
                    clearIcon: (
                        <span onClick={onClear} style={{ cursor: "pointer", display: "inline-flex" }}>
              ×
            </span>
                    ),
                }}
                style={inputStyle}
            />
        </div>
    );
}

function OrderingSelect({
                            value,
                            onChange,
                        }: {
    value: DepartmentOrdering;
    onChange: (v: DepartmentOrdering) => void;
}) {
    return (
        <Select<DepartmentOrdering>
            value={value}
            onChange={onChange}
            options={ORDERING_OPTIONS}
            style={{ height: H, minWidth: 150, flexShrink: 0 }}
            styles={{ popup: { root: { borderRadius: 10 } } }}
            variant="outlined"
        />
    );
}

function RefreshButton({ onRefresh, loading }: { onRefresh: () => void; loading: boolean }) {
    return (
        <Tooltip title="Rafraîchir">
            <Button onClick={onRefresh} loading={loading} icon={<ReloadOutlined />} style={squareBtnStyle} />
        </Tooltip>
    );
}

function ViewModeToggle({
                            viewMode,
                            onChange,
                        }: {
    viewMode: "grid" | "list";
    onChange: (m: "grid" | "list") => void;
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

export function DepartmentsToolbar({
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
                                       canExportCsv,
                                       canExportPdf,
                                       canImport,
                                   }: DepartmentsToolbarProps) {
    const filters: DeptFilters = React.useMemo(
        () => ({
            q: search?.trim() ? search.trim() : undefined,
            ordering,
        }),
        [search, ordering]
    );

    return (
        <ToolbarContainer>
            <Flex gap={10} align="center" style={{ width: "100%" }}>
                <SearchInput value={search} onChangeValue={onSearchChange} onClear={onSearchClear} />

                <OrderingSelect value={ordering} onChange={onOrderingChange} />

                <div style={dividerStyle} />

                <RefreshButton onRefresh={onRefresh} loading={loading} />

                {canExportCsv && <ExportCsvButton disabled={loading} filters={filters} />}
                {canExportPdf && <ExportPdfButton disabled={loading} filters={filters} />}
                {canImport && <ImportCsvButton disabled={loading} onDone={onRefresh} />}

                <ViewModeToggle viewMode={viewMode} onChange={onViewModeChange} />
            </Flex>

            <SearchingHint show={searching} />
        </ToolbarContainer>
    );
}