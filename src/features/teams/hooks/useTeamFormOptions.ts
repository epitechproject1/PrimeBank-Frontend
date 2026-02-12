import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { apiClient } from "../../../lib/api_client/apiClient.ts";
import { UserProfile } from "../../users/types/user.type.ts";
import { DepartmentType } from "../../departments/types/departments.type.ts";

async function fetchUsers(): Promise<UserProfile[]> {
    const { data } = await apiClient.get<UserProfile[]>("/users/");
    return data;
}

async function fetchDepartments(): Promise<DepartmentType[]> {
    const { data } = await apiClient.get<DepartmentType[]>("/departments/");
    return data;
}

interface UseTeamFormOptionsReturn {
    users: UserProfile[];
    departments: DepartmentType[];
    loadingOptions: boolean;
}

export function useTeamFormOptions(open: boolean): UseTeamFormOptionsReturn {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [departments, setDepartments] = useState<DepartmentType[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [messageApi] = message.useMessage();

    const loadOptions = useCallback(async () => {
        setLoadingOptions(true);
        try {
            const [usersData, deptsData] = await Promise.all([
                fetchUsers(),
                fetchDepartments(),
            ]);
            setUsers(usersData);
            setDepartments(deptsData);
        } catch {
            messageApi.warning("Impossible de charger les utilisateurs ou départements");
        } finally {
            setLoadingOptions(false);
        }
    }, [messageApi]);

    useEffect(() => {
        if (open) {
            loadOptions();
        }
    }, [open, loadOptions]);

    return {
        users,
        departments,
        loadingOptions,
    };
}