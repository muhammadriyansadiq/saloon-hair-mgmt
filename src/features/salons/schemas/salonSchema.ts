import { z } from 'zod';

export const salonSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    timingsId: z.array(z.number()).min(1, "At least one timing is required"),
    barbersId: z.array(z.number()).min(1, "At least one barber is required"),
    isBookingClosed: z.boolean().default(false),
});

export type SalonSchema = z.infer<typeof salonSchema>;
