import { useCallback } from "react"
import type { ShiftFormValues } from "../schemas/shift.schema"
import type { CreateShiftPayload, Shift, UpdateShiftPayload } from "../types/shift.types"

type CreateShiftFn = (payload: CreateShiftPayload) => Promise<void>
type UpdateShiftFn = (id: number, payload: UpdateShiftPayload) => Promise<void>

type Params = {
    modalMode: "create" | "edit"
    selectedShift: Shift | null
    selectedUser: number | null
    createShift: CreateShiftFn
    updateShift: UpdateShiftFn
    closeModal: () => void
    fetchShifts: () => void
}

export function useShiftSubmit({
                                   modalMode,
                                   selectedShift,
                                   selectedUser,
                                   createShift,
                                   updateShift,
                                   closeModal,
                                   fetchShifts,
                               }: Params) {
    return useCallback(
        async (values: ShiftFormValues) => {
            // Le champ user peut être absent du form si aucun user n'est
            // sélectionné dans la sidebar → on utilise selectedUser en fallback
            const userId = values.user ?? selectedUser ?? null;

            if (modalMode === "create") {
                if (userId == null) {
                    console.warn("[useShiftSubmit] user manquant, abandon");
                    return;
                }

                await createShift({
                    assignment: values.assignment ?? null,
                    user: userId,
                    date: values.date.format("YYYY-MM-DD"),
                    shift_type: values.shift_type,
                    start_time: values.start_time?.format("HH:mm:ss") ?? null,
                    end_time: values.end_time?.format("HH:mm:ss") ?? null,
                });
            }

            if (modalMode === "edit" && selectedShift) {
                await updateShift(selectedShift.id, {
                    assignment: selectedShift.assignment,
                    user: selectedShift.user,
                    date: selectedShift.date,
                    shift_type: values.shift_type,
                    start_time: values.start_time?.format("HH:mm:ss") ?? null,
                    end_time: values.end_time?.format("HH:mm:ss") ?? null,
                });
            }

            closeModal();
            fetchShifts();
        },
        [modalMode, selectedShift, selectedUser, createShift, updateShift, closeModal, fetchShifts]
    )
}