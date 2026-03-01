
import { AttendanceKPI, AttendanceKPIParams } from "../types/attendance.types";
import {apiClient} from "../../../lib/api_client/apiClient.ts";

const ENDPOINT = "/kpis/";

export async function getAttendanceKPIs(
    params: AttendanceKPIParams = {}
): Promise<AttendanceKPI> {
    const { data } = await apiClient.get(ENDPOINT, { params });
    return data;
}