// ./features/planning/shift-override/schemas/shiftOverride.schema.ts
import { z } from "zod";

export const shiftOverrideSchema = z
    .object({
        shift: z.coerce.number(),

        new_start_time: z.string().nullable().optional(), // "HH:mm"
        new_end_time: z.string().nullable().optional(),   // "HH:mm"

        cancelled: z.coerce.boolean().default(false),
        reason: z.string().max(255, "Max 255 caractères").optional(),
    })
    .refine(
        (d) =>
            d.cancelled ||
            (!!d.new_start_time && !!d.new_end_time && d.new_end_time > d.new_start_time),
        {
            message: "Heures invalides",
            path: ["new_end_time"],
        }
    );

export type ShiftOverrideFormValues = z.infer<typeof shiftOverrideSchema>;