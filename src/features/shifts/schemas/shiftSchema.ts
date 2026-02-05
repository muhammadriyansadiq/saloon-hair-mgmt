import { z } from 'zod';
import { DayOfWeek, AmPm } from '../types';

const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9]$/; // 01:00 to 12:59

export const shiftSchema = z.object({
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as [DayOfWeek, ...DayOfWeek[]], {
        required_error: "Day is required",
    }),
    title: z.string().min(1, "Title is required"),
    startTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
    startTimeAmPm: z.enum(['AM', 'PM'] as [AmPm, ...AmPm[]]),
    endTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
    endTimeAmPm: z.enum(['AM', 'PM'] as [AmPm, ...AmPm[]]),
}).refine((data) => {
    // Helper to get total minutes from midnight
    const getMinutes = (time: string, ampm: AmPm) => {
        let [hours, minutes] = time.split(':').map(Number);
        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };

    const start = getMinutes(data.startTime, data.startTimeAmPm);
    const end = getMinutes(data.endTime, data.endTimeAmPm);

    let duration = end - start;
    if (duration < 0) duration += 24 * 60; // Handle overnight

    return duration <= 12 * 60 && duration > 0;
}, {
    message: "Shift duration cannot exceed 12 hours",
    path: ["endTime"],
});

export type ShiftSchema = z.infer<typeof shiftSchema>;
