import { message } from "antd";
import { getErrorMessage } from "../../services/httpError";
import type { DepartmentOrdering } from "../../types/departments.type";

export type DeptFilters = { q?: string; ordering?: DepartmentOrdering };

export async function showApiError(err: unknown, fallback: string) {
    const msg = await getErrorMessage(err, fallback);
    message.error(msg);
}