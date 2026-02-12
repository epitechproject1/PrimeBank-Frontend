import { UserProfile } from "../../users/types/user.type.ts";
import { DepartmentType } from "../../departments/types/departments.type.ts";
import type { DefaultOptionType } from "antd/es/select";

export interface BaseSelectOption extends DefaultOptionType {
    value: number;
    label: string;
    searchLabel: string;
}

export function mapUsersToOptions(users: UserProfile[]): BaseSelectOption[] {
    return users.map((u) => ({
        value: u.id,
        label: `${u.first_name} ${u.last_name}`,
        searchLabel: `${u.first_name} ${u.last_name} ${u.email}`,
    }));
}

export function mapDepartmentsToOptions(
    departments: DepartmentType[]
): BaseSelectOption[] {
    return departments.map((d) => ({
        value: d.id,
        label: d.name,
        searchLabel: d.name,
    }));
}