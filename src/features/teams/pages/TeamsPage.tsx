import  { useCallback } from "react";
import { Grid, message } from "antd";

import TeamFormModal from "../components/TeamForm/TeamFormModal";
import { TeamDetailsModal } from "../components/TeamDetails/TeamDetailsModal";
import { TeamsPageLayout } from "./TeamsPageLayout";
import { useTeamsPage } from "../hooks/page/useTeamsPage";
import { teamService } from "../services/teams.service";
import { getErrorMessage } from "../../departments/services/httpError";
import { TeamsImportModal } from "../components/TeamsImportModal";
import {useTeamsImportCsv} from "./useTeamsImportCsv.ts";

const { useBreakpoint } = Grid;

export function TeamsPage() {
    const screens = useBreakpoint();
    const page = useTeamsPage();

    const importCsv = useTeamsImportCsv(page.refresh);

    const handleExportCsv = useCallback(async () => {
        try {
            await teamService.exportCsv({ ordering: page.ordering });
            message.success("Export CSV téléchargé avec succès.");
        } catch (err: unknown) {
            const msg = await getErrorMessage(err, "Erreur lors de l'export CSV.");
            message.error(msg);
        }
    }, [page.ordering]);

    const handleExportPdf = useCallback(async () => {
        try {
            await teamService.exportPdf({ ordering: page.ordering });
            message.success("Export PDF téléchargé avec succès.");
        } catch (err: unknown) {
            const msg = await getErrorMessage(err, "Erreur lors de l'export PDF.");
            message.error(msg);
        }
    }, [page.ordering]);

    return (
        <>
            {page.contextHolder}

            <TeamsPageLayout
                screens={screens}
                token={page.token}
                colors={page.colors}
                viewMode={page.viewMode}
                setViewMode={page.setViewMode}
                ordering={page.ordering}
                onOrderingChange={page.onOrderingChange}
                openAdd={page.openAdd}
                openEdit={page.openEdit}
                displayedTeamsCount={page.displayedTeams.length}
                deptCount={page.deptCount}
                thisMonth={page.thisMonth}
                loading={page.loading}
                spinning={page.spinning}
                search={page.searchState.search}
                searching={page.searchState.searching}
                onSearchChange={page.searchState.handleSearchChange}
                onSearchClear={page.searchState.handleSearchClear}
                refresh={page.refresh}
                filtered={page.filtered}
                getColumns={page.getColumns}
                handleDelete={page.handleDelete}
                handleView={page.handleView}
                canManage={page.canManage}
                canViewDetails={page.canViewDetails}
                canExport={page.canExport}
                canImport={page.canImport}
                onExportCsv={handleExportCsv}
                onExportPdf={handleExportPdf}
                onOpenImport={importCsv.openModal}
            />

            <TeamsImportModal
                open={importCsv.open}
                loading={importCsv.loading}
                onClose={importCsv.closeModal}
                onImport={importCsv.importCsv}
            />

            <TeamFormModal open={page.modalOpen} editTeam={page.editTeam} onClose={page.closeModal} onSaved={page.onSaved} />

            <TeamDetailsModal
                open={page.detailsOpen}
                team={page.detailsTeam}
                onClose={page.closeDetails}
                onEdit={page.openEdit}
                canEdit={page.canManage}
                colorIndex={0}
                loading={page.detailsLoading}
            />
        </>
    );
}

export default TeamsPage;