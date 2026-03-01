import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitClockCode } from "../services/clockValidation.service";

export function useSubmitClockCode() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitClockCode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clock-events"] });
            queryClient.invalidateQueries({ queryKey: ["my-shifts"] });
        },
    });
}