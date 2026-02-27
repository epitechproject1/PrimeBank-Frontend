// ./features/contracts/contract/services/contracts.service.ts

import { apiClient } from "../../../lib/api_client/apiClient";
import type {
    Contract,
    CreateContractPayload,
    UpdateContractPayload,
    ContractFilters,
} from "../types/contract.types";

const ENDPOINT = "/contracts/";

// LIST
export async function getContracts(filters?: ContractFilters): Promise<Contract[]> {
    const { data } = await apiClient.get(ENDPOINT, { params: filters });
    return data;
}

// RETRIEVE
export async function getContractById(id: number): Promise<Contract> {
    const { data } = await apiClient.get(`${ENDPOINT}${id}/`);
    return data;
}

// CREATE
export async function createContract(payload: CreateContractPayload): Promise<Contract> {
    const { data } = await apiClient.post(ENDPOINT, payload);
    return data;
}

// UPDATE
export async function updateContract(id: number, payload: UpdateContractPayload): Promise<Contract> {
    const { data } = await apiClient.put(`${ENDPOINT}${id}/`, payload);
    return data;
}

// PATCH
export async function partialUpdateContract(id: number, payload: UpdateContractPayload): Promise<Contract> {
    const { data } = await apiClient.patch(`${ENDPOINT}${id}/`, payload);
    return data;
}

// DELETE
export async function deleteContract(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINT}${id}/`);
}