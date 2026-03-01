import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    clockIn,
    clockOut,
    getMyClockEvents,
} from "../services/clockEvents.service";

export function useMyClockEvents() {
    return useQuery({
        queryKey: ["clock-events"],
        queryFn: getMyClockEvents,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
}

export function useClockIn() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (shiftId: number) => clockIn(shiftId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clock-events"] });
        },
    });
}

export function useClockOut() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (shiftId: number) => clockOut(shiftId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clock-events"] });
        },
    });
}