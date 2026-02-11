import { UserProfile } from "../../users/types/user.type.ts";

export type department = {
    id: number;
    name: string;
    description: string | null;
    director_id: UserProfile[] ;
    created_at: string;
    updated_at: string;
}