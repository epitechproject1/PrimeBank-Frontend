// ./features/contracts/contract/hooks/useContractsData.ts

import { useCallback, useState } from "react";
import { message } from "antd";
import type { AxiosError } from "axios";

import type {
    Contract,
    CreateContractPayload,
    UpdateContractPayload,
    ContractFilters,
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

export function useContractsData() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchContracts = useCallback(async (filters?: ContractFilters) => {
        setLoading(true);
        try {
            const res = await contractsService.getContracts(filters);
            setContracts(res);
        } catch (err) {
            message.error(getErrorMessage(err, "Erreur chargement contrats"));
        } finally {
            setLoading(false);
        }
    }, []);

    const createContract = useCallback(
        async (payload: CreateContractPayload, refetchFilters?: ContractFilters) => {
            try {
                await contractsService.createContract(payload);
                message.success("Contrat créé");
                await fetchContracts(refetchFilters);
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur création contrat"));
            }
        },
        [fetchContracts]
    );

    const updateContract = useCallback(
        async (id: number, payload: UpdateContractPayload, refetchFilters?: ContractFilters) => {
            try {
                await contractsService.updateContract(id, payload);
                message.success("Contrat mis à jour");
                await fetchContracts(refetchFilters);
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur mise à jour contrat"));
            }
        },
        [fetchContracts]
    );

    const deleteContract = useCallback(
        async (id: number, refetchFilters?: ContractFilters) => {
            try {
                await contractsService.deleteContract(id);
                message.success("Contrat supprimé");
                await fetchContracts(refetchFilters);
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur suppression contrat"));
            }
        },
        [fetchContracts]
    );

    return {
        contracts,
        loading,
        fetchContracts,
        createContract,
        updateContract,
        deleteContract,
    };
}