import React from "react";
import { Input, Button, Select, Space, Tooltip, Typography, message } from "antd";
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

import type { DepartmentOrdering } from "../../types/departments.type";
import type { DeptFilters } from "./toolbar.utils";
import { showApiError } from "./toolbar.utils";
import { departmentService } from "../../services/departments.service";
import { DepartmentsImportModal } from "../DepartmentsImportModal/DepartmentsImportModal";

const { Text } = Typography;

interface DepartmentsToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    onSearchClear: () => void;
    onRefresh: () => void;
    loading: boolean;
    searching: boolean;
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    ordering: DepartmentOrdering;
    onOrderingChange: (v: DepartmentOrdering) => void;

    canExportCsv?: boolean;
    canExportPdf?: boolean;
    canImport?: boolean;
}

const H = 38;
const DEFAULT_ORDERING: DepartmentOrdering = "-created_at";

const ORDERING_OPTIONS: { value: DepartmentOrdering; label: string }[] = [
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
                placeholder="Rechercher un département..."
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
    ordering: DepartmentOrdering;
    onOrderingChange: (v: DepartmentOrdering) => void;
}) {
    const selectedOrdering = (ordering ?? DEFAULT_ORDERING) as DepartmentOrdering;

    return (
        <Select
            value={selectedOrdering}
            onChange={onOrderingChange}
            style={{ width: 180, height: H, flexShrink: 0 }}
            options={ORDERING_OPTIONS}
        />
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

                                       canExportCsv = true,
                                       canExportPdf = true,
                                       canImport = true,
                                   }: DepartmentsToolbarProps) {
    const [importOpen, setImportOpen] = React.useState(false);
    const [importLoading, setImportLoading] = React.useState(false);

    const filters: DeptFilters = React.useMemo(
        () => ({
            q: search?.trim() ? search.trim() : undefined,
            ordering,
        }),
        [search, ordering]
    );

    const onExportCsv = async () => {
        try {
            await departmentService.exportCsv(filters);
            message.success("Export CSV téléchargé.");
        } catch (e: unknown) {
            await showApiError(e, "Vous n'avez pas le droit d'exporter selon votre poste.");
        }
    };

    const onExportPdf = async () => {
        try {
            await departmentService.exportPdf(filters);
            message.success("Export PDF téléchargé.");
        } catch (e: unknown) {
            await showApiError(e, "Vous n'avez pas le droit d'exporter selon votre poste.");
        }
    };

    const handleImport = async (file: File) => {
        setImportLoading(true);
        try {
            const res = await departmentService.importCsv(file);

            const info = `Créés: ${res.created} | Mis à jour: ${res.updated} | Ignorés: ${res.skipped}`;
            if (res.errors?.length) message.warning(`${info} — ${res.errors.length} erreurs.`);
            else message.success(info);

            onRefresh();
            setImportOpen(false);
        } catch (e: unknown) {
            await showApiError(e, "Vous n'avez pas le droit d'importer selon votre poste.");
        } finally {
            setImportLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <SearchBlock search={search} onSearchChange={onSearchChange} onSearchClear={onSearchClear} />

                <OrderingBlock ordering={ordering} onOrderingChange={onOrderingChange} />

                {/* ActionsBlock (copie Teams mais logique departments) */}
                <Tooltip title="Rafraîchir">
                    <Button onClick={onRefresh} loading={loading} icon={<ReloadOutlined />} style={iconBtnStyle} />
                </Tooltip>

                {canExportCsv && (
                    <Tooltip title="Exporter CSV">
                        <Button icon={<DownloadOutlined />} onClick={onExportCsv} style={iconBtnStyle} />
                    </Tooltip>
                )}

                {canExportPdf && (
                    <Tooltip title="Exporter PDF">
                        <Button icon={<FilePdfOutlined />} onClick={onExportPdf} style={iconBtnStyle} />
                    </Tooltip>
                )}

                {canImport && (
                    <Tooltip title="Importer CSV">
                        <Button
                            icon={<UploadOutlined />}
                            onClick={() => setImportOpen(true)}
                            style={iconBtnStyle}
                            disabled={loading}
                        />
                    </Tooltip>
                )}

                <ViewModeBlock viewMode={viewMode} onViewModeChange={onViewModeChange} />
            </div>

            <SearchingHint searching={searching} />

            {/* Modal EXACT Teams */}
            <DepartmentsImportModal
                open={importOpen}
                loading={importLoading}
                onClose={() => setImportOpen(false)}
                onImport={handleImport}
            />
        </div>
    );
}