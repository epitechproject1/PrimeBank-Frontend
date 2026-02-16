import { UserProfile } from "../../users";
import { DepartmentType } from "../../departments/types/departments.type";
import type { DefaultOptionType } from "antd/es/select";

export interface BaseSelectOption extends DefaultOptionType {
    value: number;
    label: string;
    searchLabel: string;
}

function normalizeUsers(
    users: UserProfile[] | { results?: UserProfile[] } | null | undefined
): UserProfile[] {
    if (Array.isArray(users)) {
        return users;
    }

    if (users && Array.isArray(users.results)) {
        return users.results;
    }

    return [];
}

function normalizeDepartments(
    departments:
        | DepartmentType[]
        | { results?: DepartmentType[] }
        | null
        | undefined
): DepartmentType[] {
    if (Array.isArray(departments)) {
        return departments;
    }

    if (departments && Array.isArray(departments.results)) {
        return departments.results;
    }

    return [];
}

export function mapUsersToOptions(
    users: UserProfile[] | { results?: UserProfile[] } | null | undefined
): BaseSelectOption[] {
    const list = normalizeUsers(users);

    return list.map((u) => ({
        value: u.id,
        label: `${u.first_name} ${u.last_name}`,
        searchLabel: `${u.first_name} ${u.last_name} ${u.email}`,
    }));
}

export function mapDepartmentsToOptions(
    departments:
        | DepartmentType[]
        | { results?: DepartmentType[] }
        | null
        | undefined
): BaseSelectOption[] {
    const list = normalizeDepartments(departments);

    return list.map((d) => ({
        value: d.id,
        label: d.name,
        searchLabel: d.name,
    }));
}
