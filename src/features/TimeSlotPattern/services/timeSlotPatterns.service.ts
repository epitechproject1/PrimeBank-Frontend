// ./features/planning/services/timeSlotPatterns.service.ts

import { apiClient } from "../../../lib/api_client/apiClient";
import {
    CreateTimeSlotPatternPayload,
    TimeSlotFilters,
    TimeSlotPattern,
    UpdateTimeSlotPatternPayload
} from "../types/timeSlotPattern.types.ts";

const ENDPOINT = "/time-slot-patterns/";

// =======================================================
// LIST
// GET /time-slots/
// =======================================================

export async function getTimeSlots(
    filters?: TimeSlotFilters
): Promise<TimeSlotPattern[]> {
    const { data } = await apiClient.get(ENDPOINT, { params: filters });
    return data;
}

// =======================================================
// RETRIEVE
// GET /time-slots/{id}/
// =======================================================

export async function getTimeSlotById(
    id: number
): Promise<TimeSlotPattern> {
    const { data } = await apiClient.get(`${ENDPOINT}${id}/`);
    return data;
}

// =======================================================
// CREATE
// POST /time-slots/
// =======================================================

export async function createTimeSlot(
    payload: CreateTimeSlotPatternPayload
): Promise<TimeSlotPattern> {
    const { data } = await apiClient.post(ENDPOINT, payload);
    return data;
}

// =======================================================
// BULK CREATE
// POST /time-slots/bulk/
// @action(detail=False)
// =======================================================

export async function bulkCreateTimeSlots(
    payload: CreateTimeSlotPatternPayload[]
): Promise<TimeSlotPattern[]> {
    const { data } = await apiClient.post(`${ENDPOINT}bulk/`, payload);
    return data;
}

// =======================================================
// UPDATE
// PUT /time-slots/{id}/
// =======================================================

export async function updateTimeSlot(
    id: number,
    payload: UpdateTimeSlotPatternPayload
): Promise<TimeSlotPattern> {
    const { data } = await apiClient.put(`${ENDPOINT}${id}/`, payload);
    return data;
}

// =======================================================
// PARTIAL UPDATE
// PATCH /time-slots/{id}/
// =======================================================

export async function partialUpdateTimeSlot(
    id: number,
    payload: UpdateTimeSlotPatternPayload
): Promise<TimeSlotPattern> {
    const { data } = await apiClient.patch(`${ENDPOINT}${id}/`, payload);
    return data;
}

// =======================================================
// DELETE
// DELETE /time-slots/{id}/
// =======================================================

export async function deleteTimeSlot(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINT}${id}/`);
}

// =======================================================
// CLEAR WEEK PATTERN SLOTS
// DELETE /time-slots/clear/?week_pattern={id}
// @action(detail=False)
// =======================================================

export async function clearTimeSlots(
    weekPatternId: number
): Promise<void> {
    await apiClient.delete(`${ENDPOINT}clear/`, {
        params: { week_pattern: weekPatternId },
    });
}