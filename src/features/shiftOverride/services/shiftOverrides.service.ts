// ./features/planning/shift-override/services/shiftOverrides.service.ts

import { apiClient } from "../../../lib/api_client/apiClient";
import type {
    ShiftOverride,
    CreateShiftOverridePayload,
    UpdateShiftOverridePayload,
    ShiftOverrideFilters,
} from "../types/shiftOverride.types";

const ENDPOINT = "/shift-overrides/";

// ==============================
// LIST (GET /shift-overrides/)
// ==============================
export async function getShiftOverrides(
    filters?: ShiftOverrideFilters
): Promise<ShiftOverride[]> {
    const { data } = await apiClient.get(ENDPOINT, { params: filters });
    return data;
}

// ==============================
// RETRIEVE (GET /shift-overrides/{id}/)
// ==============================
export async function getShiftOverrideById(id: number): Promise<ShiftOverride> {
    const { data } = await apiClient.get(`${ENDPOINT}${id}/`);
    return data;
}

// ==============================
// CREATE (POST /shift-overrides/)
// ==============================
export async function createShiftOverride(
    payload: CreateShiftOverridePayload
): Promise<ShiftOverride> {
    const { data } = await apiClient.post(ENDPOINT, payload);
    return data;
}

// ==============================
// UPDATE (PUT /shift-overrides/{id}/)
// ==============================
export async function updateShiftOverride(
    id: number,
    payload: UpdateShiftOverridePayload
): Promise<ShiftOverride> {
    const { data } = await apiClient.put(`${ENDPOINT}${id}/`, payload);
    return data;
}

// ==============================
// PARTIAL UPDATE (PATCH /shift-overrides/{id}/)
// ==============================
export async function partialUpdateShiftOverride(
    id: number,
    payload: UpdateShiftOverridePayload
): Promise<ShiftOverride> {
    const { data } = await apiClient.patch(`${ENDPOINT}${id}/`, payload);
    return data;
}

// ==============================
// DELETE (DELETE /shift-overrides/{id}/)
// ==============================
export async function deleteShiftOverride(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINT}${id}/`);
}