// ./features/planning/schemas/weekPattern.schema.ts

import { z } from "zod";

export const weekPatternSchema = z.object({
    name: z.string().min(1, "Le nom est requis").max(200),
    description: z.string().max(1000).optional().or(z.literal("")),
});

export type WeekPatternFormValues = z.infer<typeof weekPatternSchema>;