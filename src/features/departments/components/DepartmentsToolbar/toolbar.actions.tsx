import React from "react";
import { Button, Tooltip, message, theme } from "antd";
import { DownloadOutlined, UploadOutlined, FilePdfOutlined } from "@ant-design/icons";

import { departmentService } from "../../services/departments.service";
import type { DepartmentOrdering } from "../../types/departments.type";
import type { DeptFilters } from "./toolbar.utils";
import { showApiError } from "./toolbar.utils";

const { useToken } = theme;

const H = 40;

function useSquareBtnStyle(): React.CSSProperties {
    const { token } = useToken();
    return {
        height: H,
        width: H,
        borderRadius: 10,
        border: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorFillQuaternary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    };
}

async function runWithLoading(setLoading: (v: boolean) => void, fn: () => Promise<void>) {
    setLoading(true);
    try {
        await fn();
    } finally {
        setLoading(false);
    }
}
export function ExportCsvButton({
                                    disabled,
                                    filters,
                                }: {
    disabled: boolean;
    filters: { q?: string; ordering?: DepartmentOrdering };
}) {
    const [loading, setLoading] = React.useState(false);
    const squareBtnStyle = useSquareBtnStyle();

    const onExport = () =>
        runWithLoading(setLoading, async () => {
            try {
                await departmentService.exportCsv(filters);
                message.success("Export CSV téléchargé.");
            } catch (e: unknown) {
                await showApiError(e, "Vous n'avez pas le droit d'exporter selon votre poste.");
            }
        });

    return (
        <Tooltip title="Exporter en CSV">
            <Button
                onClick={onExport}
                loading={loading}
                icon={<DownloadOutlined />}
                style={squareBtnStyle}
                disabled={disabled || loading}
            />
        </Tooltip>
    );
}
export function ExportPdfButton({
                                    disabled,
                                    filters,
                                }: {
    disabled: boolean;
    filters: DeptFilters;
}) {
    const [loading, setLoading] = React.useState(false);
    const squareBtnStyle = useSquareBtnStyle();

    const onExport = () =>
        runWithLoading(setLoading, async () => {
            try {
                await departmentService.exportPdf(filters);
                message.success("Export PDF téléchargé.");
            } catch (e: unknown) {
                await showApiError(e, "Vous n'avez pas le droit d'exporter selon votre poste.");
            }
        });

    return (
        <Tooltip title="Exporter en PDF">
            <Button
                onClick={onExport}
                loading={loading}
                icon={<FilePdfOutlined />}
                style={squareBtnStyle}
                disabled={disabled || loading}
            />
        </Tooltip>
    );
}
export function ImportCsvButton({
                                    disabled,
                                    onOpen,
                                }: {
    disabled: boolean;
    onOpen: () => void;
}) {
    const squareBtnStyle = useSquareBtnStyle();

    return (
        <Tooltip title="Importer un CSV">
            <Button
                icon={<UploadOutlined />}
                style={squareBtnStyle}
                disabled={disabled}
                onClick={onOpen}
            />
        </Tooltip>
    );
}