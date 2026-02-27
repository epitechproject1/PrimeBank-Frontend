import { useState, useCallback } from "react";
import { Grid, Modal, Upload, Spin, message } from "antd";

import TeamFormModal from "../components/TeamForm/TeamFormModal";
import { TeamDetailsModal } from "../components/TeamDetails/TeamDetailsModal";
import { useTeamsPage } from "../hooks/page/useTeamsPage";
import { TeamsPageLayout } from "./TeamsPageLayout";
import { teamService } from "../services/teams.service.ts";

const { useBreakpoint } = Grid;

export function TeamsPage() {
    const screens = useBreakpoint();

    const {
        token,
        colors,
        viewMode,
        setViewMode,
        onOrderingChange,
        ordering,
        canManage,

        canExport,
        canImport,

        modalOpen,
        editTeam,
        openAdd,
        openEdit,
        closeModal,
        onSaved,
        canViewDetails,
        detailsOpen,
        detailsTeam,
        detailsLoading,
        closeDetails,
        displayedTeams,
        filtered,
        deptCount,
        thisMonth,
        loading,
        spinning,
        searchState,
        refresh,
        getColumns,
        handleDelete,
        contextHolder,
        handleView,
    } = useTeamsPage();

    const [importModalOpen, setImportModalOpen] = useState(false);
    const [importLoading, setImportLoading] = useState(false);

    const handleExportCsv = useCallback(async () => {
        try {
            await teamService.exportCsv({ ordering });
            message.success("Export CSV téléchargé avec succès.");
        } catch {
            message.error("Erreur lors de l'export CSV.");
        }
    }, [ordering]);

    const handleExportPdf = useCallback(async () => {
        try {
            await teamService.exportPdf({ ordering });
            message.success("Export PDF téléchargé avec succès.");
        } catch {
            message.error("Erreur lors de l'export PDF.");
        }
    }, [ordering]);

    const handleImportCsv = useCallback(
        async (file: File) => {
            setImportLoading(true);
            try {
                const result = await teamService.importCsv(file);

                if (result.errors.length > 0) {
                    message.warning(
                        `Import terminé : ${result.created} créés, ${result.updated} mis à jour, ${result.errors.length} erreur(s).`
                    );
                } else {
                    message.success(
                        `Import réussi : ${result.created} créés, ${result.updated} mis à jour.`
                    );
                }

                setImportModalOpen(false);
                refresh();
            } catch (err: any) {
                message.error(err?.message ?? "Erreur lors de l'import CSV.");
            } finally {
                setImportLoading(false);
            }
        },
        [refresh]
    );

    return (
        <>
            {contextHolder}

            <TeamsPageLayout
                screens={screens}
                token={token}
                colors={colors}
                viewMode={viewMode}
                setViewMode={setViewMode}
                ordering={ordering}
                onOrderingChange={onOrderingChange}
                openAdd={openAdd}
                openEdit={openEdit}
                displayedTeamsCount={displayedTeams.length}
                deptCount={deptCount}
                thisMonth={thisMonth}
                loading={loading}
                spinning={spinning}
                search={searchState.search}
                searching={searchState.searching}
                onSearchChange={searchState.handleSearchChange}
                onSearchClear={searchState.handleSearchClear}
                refresh={refresh}
                filtered={filtered}
                getColumns={getColumns}
                handleDelete={handleDelete}
                handleView={handleView}
                canManage={canManage}
                canViewDetails={canViewDetails}
                canExport={canExport}
                canImport={canImport}
                onExportCsv={handleExportCsv}
                onExportPdf={handleExportPdf}
                onOpenImport={() => setImportModalOpen(true)}
            />

            <Modal
                title="Importer des équipes (CSV)"
                open={importModalOpen}
                onCancel={() => !importLoading && setImportModalOpen(false)}
                footer={null}
                destroyOnClose
                maskClosable={!importLoading}
            >
                <Upload.Dragger
                    accept=".csv"
                    showUploadList={false}
                    disabled={importLoading}
                    beforeUpload={(file) => {
                        handleImportCsv(file);
                        return false;
                    }}
                    style={{ padding: "20px 0" }}
                >
                    <p className="ant-upload-drag-icon" style={{ fontSize: 40 }}>
                        📂
                    </p>
                    <p className="ant-upload-text">
                        Glissez votre fichier CSV ici ou cliquez pour sélectionner
                    </p>
                    <p className="ant-upload-hint">
                        Formats acceptés : .csv — encodage UTF-8 recommandé
                    </p>
                </Upload.Dragger>

                {importLoading && (
                    <div style={{ textAlign: "center", marginTop: 20 }}>
                        <Spin tip="Import en cours…" />
                    </div>
                )}
            </Modal>

            <TeamFormModal
                open={modalOpen}
                editTeam={editTeam}
                onClose={closeModal}
                onSaved={onSaved}
            />

            <TeamDetailsModal
                open={detailsOpen}
                team={detailsTeam}
                onClose={closeDetails}
                onEdit={openEdit}
                canEdit={canManage}
                colorIndex={0}
                loading={detailsLoading}
            />
        </>
    );
}

export default TeamsPage;