import { z } from "zod";
import {SlotType} from "../types/timeSlotPattern.types.ts";

export const timeSlotPatternSchema = z
    .object({
        week_pattern: z.number(),
        weekday: z.number().min(0).max(6),
        start_time: z.string(),
        end_time: z.string(),
        slot_type: z.nativeEnum(SlotType),
    })
    .refine((d) => d.end_time > d.start_time, {
        message: "L'heure de fin doit être après l'heure de début",
        path: ["end_time"],
    });

export type TimeSlotPatternFormValues = z.infer<typeof timeSlotPatternSchema>;