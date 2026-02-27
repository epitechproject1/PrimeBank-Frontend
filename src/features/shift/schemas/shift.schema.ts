// ./features/planning/shift/schemas/shift.schema.ts
import { z } from "zod";
import dayjs, { Dayjs } from "dayjs";

/**
 * Zod helper: accepte Dayjs uniquement
 */
const zDayjs = z.custom<Dayjs>(
    (v) => dayjs.isDayjs(v),
    { message: "Date/heure invalide" }
);

export const shiftFormSchema = z
    .object({
        user: z.coerce.number(),
        assignment: z.coerce.number(),

        // ✅ AntD DatePicker => Dayjs
        date: zDayjs,

        // ✅ AntD TimePicker => Dayjs | null
        // (null autorisé pour HOLIDAY/OFF)
        start_time: zDayjs.nullable().optional(),
        end_time: zDayjs.nullable().optional(),

        shift_type: z.enum(["WORK", "BREAK"]).default("WORK"),
        overridden: z.coerce.boolean().optional().default(false),
    })
    .refine(
        (d) => {
            // si l'un des deux est absent => OK (journée entière)
            if (!d.start_time || !d.end_time) return true;
            return d.end_time.isAfter(d.start_time);
        },
        { message: "Heure de fin invalide", path: ["end_time"] }
    );

export type ShiftFormValues = z.infer<typeof shiftFormSchema>;

/**
 * Mapper UI -> API
 * (tu l'appelles dans handleCreateSubmit)
 */
export function toCreateShiftPayload(values: ShiftFormValues) {
    return {
        assignment: values.assignment,
        user: values.user,
        date: values.date.format("YYYY-MM-DD"),
        shift_type: values.shift_type,
        start_time: values.start_time ? values.start_time.format("HH:mm:ss") : null,
        end_time: values.end_time ? values.end_time.format("HH:mm:ss") : null,
        overridden: values.overridden ?? false,
    };
}