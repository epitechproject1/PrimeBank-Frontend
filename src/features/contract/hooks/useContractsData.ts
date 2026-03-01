import { useCallback, useState } from "react";
import { message } from "antd";
import type { AxiosError } from "axios";

import type {
    Contract,
    ContractFilters,
    ContractSearchStats,
    CreateContractPayload,
    UpdateContractPayload,
} from "../types/contract.types";

import * as contractsService from "../services/contracts.service";

type ApiErrorShape = { detail?: string; message?: string };

function getErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof Error) return err.message;
    const axiosErr = err as AxiosError<ApiErrorShape>;
    const data = axiosErr?.response?.data;
    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (typeof data.detail === "string") return data.detail;
    if (typeof data.message === "string") return data.message;
    return fallback;
}

const EMPTY_STATS: ContractSearchStats = {
    total: 0,
    active: 0,
    expiring_soon: 0,
    expired: 0,
};

export function useContractsData() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [stats, setStats] = useState<ContractSearchStats>(EMPTY_STATS);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchContracts = useCallback(async (filters?: ContractFilters) => {
        setLoading(true);
        try {
            const res = await contractsService.searchContracts(filters);
            setContracts(res.data);
            setStats(res.stats ?? EMPTY_STATS);
            setTotal(res.total ?? 0);
            setPage(res.page ?? 1);
            setPageSize(res.page_size ?? 10);
            setTotalPages(res.total_pages ?? 1);
        } catch (err) {
            message.error(getErrorMessage(err, "Erreur chargement contrats"));
        } finally {
            setLoading(false);
        }
    }, []);

    const createContract = useCallback(
        async (payload: CreateContractPayload) => {
            await contractsService.createContract(payload);
        },
        []
    );

    const updateContract = useCallback(async (id: number, payload: UpdateContractPayload) => {
        await contractsService.updateContract(id, payload);
    }, []);

    const deleteContract = useCallback(async (id: number) => {
        await contractsService.deleteContract(id);
    }, []);

    const exportPdf = useCallback(async (id: number) => {
        await contractsService.exportContractPdf(id);
    }, []);

    return {
        contracts,
        stats,
        loading,
        page,
        pageSize,
        total,
        totalPages,
        fetchContracts,
        createContract,
        updateContract,
        deleteContract,
        exportPdf,
    };
}
