import type { UserProfile } from "../../users";
import type { DepartmentType } from "../../departments/types/departments.type";

export type TeamMember = UserProfile;

export type TeamType = {
    id: number;
    name: string;
    description: string | null;

    owner: UserProfile | null;
    department: DepartmentType | null;

    members_count: number;
    members?: TeamMember[];
    members_preview?: TeamMember[];

    created_at: string;
    updated_at: string;
};

export type CreateTeamPayload = {
    name: string;
    description?: string | null;
    owner_id?: number;
    department_id?: number;
    members_ids?: number[];
};

export type UpdateTeamPayload = Partial<CreateTeamPayload>;

export interface TeamFilters {
    owner_id?: number;
    department_id?: number;
    my_teams?: boolean;
    q?: string;

    ordering?:
        | "name" | "-name"
        | "created_at" | "-created_at"
        | "updated_at" | "-updated_at"
        | "members_count" | "-members_count";
}

export interface TeamMembersParams {
    q?: string;
    page?: number;
    page_size?: number;

    ordering?: "first_name" | "-first_name" | "last_name" | "-last_name" | "email" | "-email";
}

export type ApiListResponse<T> = {
    data: T[];
    total: number;
    query?: string;
};

export type ApiPaginatedResponse<T> = {
    count: number;
    next: boolean;
    previous: boolean;
    results: T[];

    page: number;
    page_size: number;
    total_pages: number;
};

export type ApiSearchResponse<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    query: string;
};
