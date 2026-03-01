// ./features/contracts/contract/types/contract.types.ts

// ==============================
// MODEL
// ==============================
import {ContractType} from "../../contract_types/types/contract_type.types.ts";
import {User} from "../../users";

export interface Contract {
    id: number;
    user: number;
    user_detail?: User;
    contract_type: number;
    contract_type_detail?: ContractType;

    start_date: string; // YYYY-MM-DD
    end_date?: string | null;

    weekly_hours_target?: string | null;
    status?: "active" | "expiring_soon" | "expired";

    created_at: string;
}

// ==============================
// PAYLOADS
// ==============================
export interface CreateContractPayload {
    user: number;
    contract_type: number;
    start_date: string;
    end_date?: string | null;
    weekly_hours_target?: number | string | null;
}

export type UpdateContractPayload = Partial<CreateContractPayload>;

// ==============================
// FILTERS
// ==============================
export interface ContractFilters {
    q?: string;
    status?: "active" | "expiring_soon" | "expired";
    user?: number;
    contract_type?: number;
    page?: number;
    page_size?: number;
    ordering?: string;
}

export interface ContractSearchStats {
    total: number;
    active: number;
    expiring_soon: number;
    expired: number;
}

export interface ContractSearchResponse {
    data: Contract[];
    total: number;
    query: string;
    page: number;
    page_size: number;
    total_pages: number;
    stats: ContractSearchStats;
}
