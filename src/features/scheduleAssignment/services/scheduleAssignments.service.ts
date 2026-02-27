import { apiClient } from "../../../lib/api_client/apiClient";
import {
    ScheduleAssignment,
    CreateScheduleAssignmentPayload,
    UpdateScheduleAssignmentPayload,
    ScheduleAssignmentFilters,
} from "../types/scheduleAssignment.types";
import {PaginatedResponse} from "../../week-pattern/services/weekPatterns.service.ts";

const ENDPOINT = "/assignments/";

// ==============================
// LIST (pagination + search)
// ==============================
export async function getScheduleAssignments(
    filters: ScheduleAssignmentFilters = {}
): Promise<PaginatedResponse<ScheduleAssignment>> {
    const { data } = await apiClient.get(ENDPOINT, { params: filters });
    return data;
}

// ==============================
// RETRIEVE
// ==============================
export async function getScheduleAssignmentById(
    id: number
): Promise<ScheduleAssignment> {
    const { data } = await apiClient.get(`${ENDPOINT}${id}/`);
    return data;
}

// ==============================
// CREATE
// ==============================
export async function createScheduleAssignment(
    payload: CreateScheduleAssignmentPayload
): Promise<ScheduleAssignment> {
    const { data } = await apiClient.post(ENDPOINT, payload);
    return data;
}

// ==============================
// UPDATE (PUT)
// ==============================
export async function updateScheduleAssignment(
    id: number,
    payload: UpdateScheduleAssignmentPayload
): Promise<ScheduleAssignment> {
    const { data } = await apiClient.put(`${ENDPOINT}${id}/`, payload);
    return data;
}

// ==============================
// PARTIAL UPDATE (PATCH)
// ==============================
export async function partialUpdateScheduleAssignment(
    id: number,
    payload: UpdateScheduleAssignmentPayload
): Promise<ScheduleAssignment> {
    const { data } = await apiClient.patch(`${ENDPOINT}${id}/`, payload);
    return data;
}

// ==============================
// DELETE
// ==============================
export async function deleteScheduleAssignment(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINT}${id}/`);
}

// ==============================
// GENERATE SHIFTS
// ==============================

export interface GenerateShiftsPayload {
    include_holidays?: boolean;
}

export interface GenerateShiftsResponse {
    assignment_id: number;
    created_shifts: number;
    include_holidays: boolean;
}

export async function generateShiftsForAssignment(
    id: number,
    payload: GenerateShiftsPayload = {}
): Promise<GenerateShiftsResponse> {
    const { data } = await apiClient.post(
        `${ENDPOINT}${id}/generate-shifts/`,
        payload
    );
    return data;
}