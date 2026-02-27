// ./features/planning/services/weekPatterns.service.ts
import { apiClient } from "../../../lib/api_client/apiClient.ts";
import {
    CreateWeekPatternPayload,
    UpdateWeekPatternPayload,
    WeekPattern,
    WeekPatternFilters
} from "../types/weekPattern.types.ts";

const ENDPOINT = "/week-patterns/";

export type PaginatedResponse<T> = {
    count: number;
    results: T[];
};
/**
 * LIST (GET /week-patterns/)
 */
export async function getWeekPatterns(
    filters?: WeekPatternFilters
): Promise<PaginatedResponse<WeekPattern>> {
    const { data } = await apiClient.get(ENDPOINT, { params: filters });
    return data;
}

/**
 * RETRIEVE (GET /week-patterns/{id}/)
 */
export async function getWeekPatternById(id: number): Promise<WeekPattern> {
    const { data } = await apiClient.get(`${ENDPOINT}${id}/`);
    return data;
}

/**
 * CREATE (POST /week-patterns/)
 */
export async function createWeekPattern(
    payload: CreateWeekPatternPayload
): Promise<WeekPattern> {
    const { data } = await apiClient.post(ENDPOINT, payload);
    return data;
}

/**
 * UPDATE (PUT /week-patterns/{id}/)
 */
export async function updateWeekPattern(
    id: number,
    payload: UpdateWeekPatternPayload
): Promise<WeekPattern> {
    const { data } = await apiClient.put(`${ENDPOINT}${id}/`, payload);
    return data;
}

/**
 * PARTIAL UPDATE (PATCH /week-patterns/{id}/)
 */
export async function partialUpdateWeekPattern(
    id: number,
    payload: Partial<UpdateWeekPatternPayload>
): Promise<WeekPattern> {
    const { data } = await apiClient.patch(`${ENDPOINT}${id}/`, payload);
    return data;
}

/**
 * DELETE (DELETE /week-patterns/{id}/)
 */
export async function deleteWeekPattern(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINT}${id}/`);
}

/**
 * DUPLICATE (POST /week-patterns/{id}/duplicate/)
 * @action(detail=True, methods=["post"])
 */
export async function duplicateWeekPattern(
    id: number,
    payload?: { name?: string }
): Promise<WeekPattern> {
    const { data } = await apiClient.post(`${ENDPOINT}${id}/duplicate/`, payload);
    return data;
}