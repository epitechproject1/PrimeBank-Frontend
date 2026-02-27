// ./features/contract_types/contract-type/services/contractTypes.service.ts

import { apiClient } from "../../../lib/api_client/apiClient";
import {
    ContractType,
    ContractTypeFilters,
    CreateContractTypePayload,
    UpdateContractTypePayload
} from "../types/contract_type.types.ts";

const ENDPOINT = "/contract/";

// LIST
export async function getContractTypes(filters?: ContractTypeFilters): Promise<ContractType[]> {
    const { data } = await apiClient.get(ENDPOINT, { params: filters });
    return data;
}

// RETRIEVE
export async function getContractTypeById(id: number): Promise<ContractType> {
    const { data } = await apiClient.get(`${ENDPOINT}${id}/`);
    return data;
}

// CREATE
export async function createContractType(payload: CreateContractTypePayload): Promise<ContractType> {
    const { data } = await apiClient.post(ENDPOINT, payload);
    return data;
}

// UPDATE
export async function updateContractType(id: number, payload: UpdateContractTypePayload): Promise<ContractType> {
    const { data } = await apiClient.put(`${ENDPOINT}${id}/`, payload);
    return data;
}

// PATCH
export async function partialUpdateContractType(id: number, payload: UpdateContractTypePayload): Promise<ContractType> {
    const { data } = await apiClient.patch(`${ENDPOINT}${id}/`, payload);
    return data;
}

// DELETE
export async function deleteContractType(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINT}${id}/`);
}