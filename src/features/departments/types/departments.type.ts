import type { UserProfile } from "../../users";

export type DepartmentType = {
    id: number;
    name: string;
    description: string | null;
    director: UserProfile | null;
    is_active: boolean;

    employees_count?: number;
    teams_count?: number;

    created_at: string;
    updated_at: string;
};

export type CreateDepartmentPayload = {
    name: string;
    description?: string | null;
    director_id?: number | null;
    is_active?: boolean;
};
export type DepartmentStats = {
    total_departments: number;
    total_employees: number;
    avg_per_department: number;
    this_month_count?: number;
    timestamp?: string;
};

export type UpdateDepartmentPayload = Partial<CreateDepartmentPayload>;

export type ApiListResponse<T> = {
    data: T[];
    total: number;
    query?: string;
};

export type ApiPaginatedResponse<T> = {
    results: T[];
    count: number;
    next?: string | null;
    previous?: string | null;
};
