// ./features/planning/shift/services/shifts.service.ts

import { apiClient } from "../../../lib/api_client/apiClient";
import {
    Shift,
    CreateShiftPayload,
    UpdateShiftPayload,
    ShiftFilters,
} from "../types/shift.types";
import {PaginatedResponse} from "../../week-pattern/services/weekPatterns.service.ts";

const ENDPOINT = "/shifts/";

export async function getShifts(
    filters: ShiftFilters = {}
): Promise<PaginatedResponse<Shift>> {
    const { data } = await apiClient.get(ENDPOINT, { params: filters });
    return data;
}

export async function getShiftById(id: number): Promise<Shift> {
    const { data } = await apiClient.get(`${ENDPOINT}${id}/`);
    return data;
}

export async function createShift(
    payload: CreateShiftPayload
): Promise<Shift> {
    const { data } = await apiClient.post(ENDPOINT, payload);
    return data;
}

export async function updateShift(
    id: number,
    payload: UpdateShiftPayload
): Promise<Shift> {
    const { data } = await apiClient.put(`${ENDPOINT}${id}/`, payload);
    return data;
}

export async function deleteShift(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINT}${id}/`);
}