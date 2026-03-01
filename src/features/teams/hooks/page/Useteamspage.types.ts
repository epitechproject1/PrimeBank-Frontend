import type React from "react";
import type { TeamFilters, TeamType } from "../../types/teams.type";

export type UseTeamsPageReturn = {
    token: { colorPrimary: string };
    colors: { primary: string; success: string; warning: string };
    contextHolder: React.ReactNode;

    teams: TeamType[];
    displayedTeams: TeamType[];
    filtered: TeamType[];
    loading: boolean;
    spinning: boolean;

    deptCount: number;
    thisMonth: number;

    ordering: TeamFilters["ordering"];
    onOrderingChange: (v: TeamFilters["ordering"]) => void;

    searchState: {
        search: string;
        searching: boolean;
        handleSearchChange: (v: string) => void;
        handleSearchClear: () => void;
    };

    canManage: boolean;
    canExport: boolean;
    canImport: boolean;
    canViewDetails: (team: TeamType) => boolean;

    refresh: () => void;

    modalOpen: boolean;
    editTeam: TeamType | null;
    openAdd: () => void;
    openEdit: (team: TeamType) => Promise<void>;
    closeModal: () => void;
    onSaved: () => Promise<void>;

    detailsOpen: boolean;
    detailsTeam: TeamType | null;
    detailsLoading: boolean;
    handleView: (team: TeamType) => void;
    closeDetails: () => void;

    handleDelete: (id: number) => Promise<void>;

    getColumns: any;
    setViewMode: any;
    viewMode: any;
    setOrdering: any;
};