import { z } from 'zod';

export const salonSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    timingsId: z.coerce.number().min(1, "Timing/Shift is required"),
    barberId: z.coerce.number().min(1, "Barber is required"),
    isBookingClosed: z.boolean().default(false),
});

export type SalonSchema = z.infer<typeof salonSchema>;
