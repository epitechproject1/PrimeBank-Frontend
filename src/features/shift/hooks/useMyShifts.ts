import { useQuery } from "@tanstack/react-query";
import { getMyShifts } from "../services/shifts.service";
import { ShiftFilters } from "../types/shift.types";

export function useMyShifts(filters: ShiftFilters = {}) {
    return useQuery({
        queryKey: ["my-shifts", filters],
        queryFn: () => getMyShifts(filters),
    });
}