import React from "react";
import { Button, Tooltip, Upload, message } from "antd";
import type { UploadProps } from "antd";
import { DownloadOutlined, UploadOutlined, FilePdfOutlined } from "@ant-design/icons";

import { departmentService } from "../../services/departments.service";
import type { DepartmentOrdering } from "../../types/departments.type";
import type { DeptFilters } from "./toolbar.utils";
import { showApiError } from "./toolbar.utils";

const H = 40;

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

async function runWithLoading(
    setLoading: (v: boolean) => void,
    fn: () => Promise<void>
) {
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

    const onExport = () =>
        runWithLoading(setLoading, async () => {
            try {
                await departmentService.exportCsv(filters);
                message.success("Export CSV téléchargé.");
            } catch (e: unknown) {
                await showApiError(e, "Vous n’avez pas le droit d’exporter selon votre poste.");
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

    const onExport = () =>
        runWithLoading(setLoading, async () => {
            try {
                await departmentService.exportPdf(filters);
                message.success("Export PDF téléchargé.");
            } catch (e: unknown) {
                await showApiError(e, "Vous n’avez pas le droit d’exporter selon votre poste.");
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
                                    onDone,
                                }: {
    disabled: boolean;
    onDone: () => void;
}) {
    const [loading, setLoading] = React.useState(false);

    const uploadProps: UploadProps = {
        accept: ".csv",
        maxCount: 1,
        showUploadList: false,
        beforeUpload: async (file) => {
            await runWithLoading(setLoading, async () => {
                try {
                    const res = await departmentService.importCsv(file as File);

                    const info = `Créés: ${res.created} | Mis à jour: ${res.updated} | Ignorés: ${res.skipped}`;
                    if (res.errors?.length) {
                        message.warning(`${info} — ${res.errors.length} erreurs.`);
                    } else {
                        message.success(info);
                    }

                    onDone();
                } catch (e: unknown) {
                    await showApiError(e, "Vous n’avez pas le droit d’importer selon votre poste.");
                }
            });

            return false;
        },
    };

    return (
        <Upload {...uploadProps} disabled={disabled || loading}>
            <Tooltip title="Importer un CSV">
                <Button
                    icon={<UploadOutlined />}
                    style={squareBtnStyle}
                    loading={loading}
                    disabled={disabled || loading}
                />
            </Tooltip>
        </Upload>
    );
}