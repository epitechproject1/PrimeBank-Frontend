import { apiClient } from "../../../lib/api_client/apiClient";
import type {
    Contract,
    ContractFilters,
    ContractSearchResponse,
    CreateContractPayload,
    UpdateContractPayload,
} from "../types/contract.types";

const ENDPOINT = "/contracts/";

export async function searchContracts(
    filters?: ContractFilters
): Promise<ContractSearchResponse> {
    const { data } = await apiClient.get<ContractSearchResponse>(
        `${ENDPOINT}search/`,
        { params: filters }
    );
    return data;
}

export async function getContractById(id: number): Promise<Contract> {
    const { data } = await apiClient.get(`${ENDPOINT}${id}/`);
    return data;
}

export async function createContract(payload: CreateContractPayload): Promise<Contract> {
    const { data } = await apiClient.post(ENDPOINT, payload);
    return data;
}

export async function updateContract(
    id: number,
    payload: UpdateContractPayload
): Promise<Contract> {
    const { data } = await apiClient.put(`${ENDPOINT}${id}/`, payload);
    return data;
}

export async function deleteContract(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINT}${id}/`);
}

export async function exportContractPdf(id: number): Promise<void> {
    const response = await apiClient.get<Blob>(`${ENDPOINT}${id}/export/`, {
        responseType: "blob",
    });

    const url = URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contract_${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
