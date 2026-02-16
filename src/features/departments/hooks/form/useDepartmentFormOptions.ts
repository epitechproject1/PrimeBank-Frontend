import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import type { AxiosError } from "axios";
import { apiClient } from "../../../../lib/api_client/apiClient";
import type { UserProfile } from "../../../users";

type AnyObj = Record<string, unknown>;

function isObj(v: unknown): v is AnyObj {
    return typeof v === "object" && v !== null;
}

function pickArray<T>(v: unknown): T[] | null {
    return Array.isArray(v) ? (v as T[]) : null;
}

function normalizeList<T>(payload: unknown): T[] {
    const direct = pickArray<T>(payload);
    if (direct) return direct;

    if (!isObj(payload)) return [];
    const results = pickArray<T>(payload["results"]);
    if (results) return results;
    const dataArr = pickArray<T>(payload["data"]);
    if (dataArr) return dataArr;
    const dataObj = payload["data"];
    if (isObj(dataObj)) {
        const nestedResults = pickArray<T>(dataObj["results"]);
        if (nestedResults) return nestedResults;

        const nestedData = pickArray<T>(dataObj["data"]);
        if (nestedData) return nestedData;
    }

    return [];
}

function getErrorMessage(err: unknown, fallback: string) {
    const axiosErr = err as AxiosError<{ detail?: string; message?: string }>;
    const data = axiosErr?.response?.data;

    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.message === "string") return data.message;
    if (err instanceof Error) return err.message;

    return fallback;
}

async function fetchUsers(): Promise<UserProfile[]> {
    const res = await apiClient.get<unknown>("/users/");
    return normalizeList<UserProfile>(res.data);
}

interface UseDepartmentFormOptionsReturn {
    users: UserProfile[];
    loadingUsers: boolean;
}

export function useDepartmentFormOptions(open: boolean): UseDepartmentFormOptionsReturn {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const loadUsers = useCallback(async () => {
        setLoadingUsers(true);
        try {
            const usersData = await fetchUsers();
            setUsers(usersData);
        } catch (err) {
            message.warning(getErrorMessage(err, "Impossible de charger les utilisateurs"));
            setUsers([]);
        } finally {
            setLoadingUsers(false);
        }
    }, []);

    useEffect(() => {
        if (open) loadUsers();
    }, [open, loadUsers]);

    return { users, loadingUsers };
}
