import type { UserProfile } from "../../users/types/user.type";
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
}

export type ApiListResponse<T> = {
    data: T[];
    total: number;
    query?: string;
};

export type ApiSearchResponse<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    query: string;
};
