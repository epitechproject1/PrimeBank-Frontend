import { apiClient } from "../../../lib/api_client/apiClient";

export type SubmitClockCodePayload = {
    code: string;
};

export type SubmitClockCodeResponse = {
    success: boolean;
    event: any; // tu peux typer avec ClockEvent si tu veux strict
    detail?: string;
};

const ENDPOINT = "/clock-validations/submit/";

export async function submitClockCode(
    payload: SubmitClockCodePayload
): Promise<SubmitClockCodeResponse> {
    const { data } = await apiClient.post(ENDPOINT, payload);
    return data;
}