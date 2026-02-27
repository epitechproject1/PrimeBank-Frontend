// ./features/contract_types/contract-type/types/contractType.types.ts

// ==============================
// MODEL
// ==============================
export interface ContractType {
    id: number;
    name: string;
    code: string;
    description?: string;
    requires_end_date: boolean;
}

// ==============================
// PAYLOADS
// ==============================
export interface CreateContractTypePayload {
    name: string;
    code: string;
    description?: string;
    requires_end_date?: boolean;
}

export type UpdateContractTypePayload = Partial<CreateContractTypePayload>;

// ==============================
// FILTERS
// ==============================
export interface ContractTypeFilters {
    search?: string;
    ordering?: string;
}