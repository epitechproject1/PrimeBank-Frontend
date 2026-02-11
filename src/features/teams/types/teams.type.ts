import {UserProfile} from "../../users/types/user.type.ts";
import {department} from "../../departments/types/departments.type.ts";

export type TeamType = {
    id: number;
    name: string;
    description: string | null;
    owner: UserProfile;
    department: department;
    created_at: string;
    updated_at: string;
};
export type CreateTeamPayload = {
    name: string;
    description?: string | null;
    owner_id: number;
    department_id: number;
};

export type UpdateTeamPayload = Partial<CreateTeamPayload>;

export interface TeamFilters {
    owner_id?: number;
    department_id?: number;
    my_teams?: boolean;
}