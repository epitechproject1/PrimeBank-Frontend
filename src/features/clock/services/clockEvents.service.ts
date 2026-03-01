import { apiClient } from "../../../lib/api_client/apiClient";
import { PaginatedResponse } from "../../week-pattern/services/weekPatterns.service";

export type ClockEvent = {
    id: number;
    user: number;
    user_email: string;
    shift: number;
    shift_date: string;
    event_type: "CLOCK_IN" | "CLOCK_OUT";
    event_type_label: string;
    timestamp: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    status_label: string;
    note: string;
    created_at: string;
};

export type ClockCodeResponse = {
    id: number;
    code: string;
    expires_at: string;
};

const ENDPOINT = "/clock-events/";

export async function getMyClockEvents(
    params: Record<string, any> = {}
): Promise<PaginatedResponse<ClockEvent>> {
    const { data } = await apiClient.get(ENDPOINT, { params });
    return data;
}

export async function clockIn(shift: number): Promise<ClockCodeResponse> {
    const { data } = await apiClient.post(`${ENDPOINT}clock-in/`, { shift });
    return data;
}

export async function clockOut(shift: number): Promise<ClockCodeResponse> {
    const { data } = await apiClient.post(`${ENDPOINT}clock-out/`, { shift });
    return data;
}