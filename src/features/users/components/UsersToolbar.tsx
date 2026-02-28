import { Flex, Input, Button, Select } from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    DownloadOutlined,
} from "@ant-design/icons";

interface UsersToolbarProps {
    search: string;
    pageSize: number;
    onSearchChange: (value: string) => void;
    onPageSizeChange: (value: number) => void;
    onRefresh: () => void;
    loading: boolean;
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    placeholderColor: string;
    onExportCsv: () => void;
    onExportPdf: () => void;
    exporting: boolean;
}

export function UsersToolbar({
    search,
    pageSize,
    onSearchChange,
    onPageSizeChange,
    onRefresh,
    loading,
    viewMode,
    onViewModeChange,
    placeholderColor,
    onExportCsv,
    onExportPdf,
    exporting,
}: UsersToolbarProps) {
    const exportDisabled = loading || exporting;
    const pageSizeOptions = [5, 10, 20, 50, 100, 500].map((value) => ({
        value,
        label: `${value}`,
    }));

    return (
        <Flex gap={12} style={{ marginBottom: 20 }} wrap="wrap">
            <Input
                prefix={<SearchOutlined style={{ color: placeholderColor }} />}
                placeholder="Recherche globale..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                allowClear
                style={{ flex: 1, minWidth: 260 }}
            />
            <Select
                value={pageSize}
                onChange={onPageSizeChange}
                options={pageSizeOptions}
                style={{ width: 120 }}
            />
            <Button
                icon={<ReloadOutlined />}
                onClick={onRefresh}
                loading={loading}
                title="Rafraichir"
            />
            <Button
                icon={<DownloadOutlined />}
                onClick={onExportCsv}
                disabled={exportDisabled}
            >
                Exporter CSV
            </Button>
            <Button
                icon={<DownloadOutlined />}
                onClick={onExportPdf}
                disabled={exportDisabled}
            >
                Exporter PDF
            </Button>
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
        </Flex>
    );
}
