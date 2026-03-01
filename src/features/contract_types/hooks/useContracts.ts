// ./features/contract_types/contract-types/hooks/useContractTypesData.ts

import { useCallback, useState } from "react";
import { message } from "antd";
import type { AxiosError } from "axios";

import type {
    ContractType,
    ContractTypeFilters,
    CreateContractTypePayload,
    UpdateContractTypePayload,
} from "../types/contract_type.types.ts";

import * as contractTypesService from "../services/contract_type.service.ts";

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

export function useContractTypesData() {
    const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
    const [loading, setLoading] = useState(false);

    // ==============================
    // FETCH
    // ==============================
    const fetchContractTypes = useCallback(async (filters?: ContractTypeFilters) => {
        setLoading(true);
        try {
            const res = await contractTypesService.getContractTypes(filters);
            setContractTypes(res);
        } catch (err) {
            message.error(getErrorMessage(err, "Erreur chargement types de contrat"));
        } finally {
            setLoading(false);
        }
    }, []);

    // ==============================
    // CREATE
    // ==============================
    const createContractType = useCallback(
        async (payload: CreateContractTypePayload, refetchFilters?: ContractTypeFilters) => {
            try {
                await contractTypesService.createContractType(payload);
                message.success("Type de contrat créé");
                await fetchContractTypes(refetchFilters);
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur création types de contrat"));
            }
        },
        [fetchContractTypes]
    );

    // ==============================
    // UPDATE
    // ==============================
    const updateContractType = useCallback(
        async (id: number, payload: UpdateContractTypePayload, refetchFilters?: ContractTypeFilters) => {
            try {
                await contractTypesService.updateContractType(id, payload);
                message.success("Type de contrat mis à jour");
                await fetchContractTypes(refetchFilters);
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur mise à jour types de contrat"));
            }
        },
        [fetchContractTypes]
    );

    // ==============================
    // DELETE
    // ==============================
    const deleteContractType = useCallback(
        async (id: number, refetchFilters?: ContractTypeFilters) => {
            try {
                await contractTypesService.deleteContractType(id);
                message.success("Type de contrat supprimé");
                await fetchContractTypes(refetchFilters);
            } catch (err) {
                message.error(getErrorMessage(err, "Erreur suppression types de contrat"));
            }
        },
        [fetchContractTypes]
    );

    return {
        contractTypes,
        loading,
        fetchContractTypes,
        createContractType,
        updateContractType,
        deleteContractType,
    };
}