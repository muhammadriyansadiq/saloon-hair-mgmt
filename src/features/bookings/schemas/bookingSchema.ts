
import { z } from 'zod';

export const bookingSchema = z.object({
    barberId: z.number().min(1, "Barber is required"),
    userId: z.number().min(1, "User ID is required"),
    serviceIds: z.array(z.number()).default([]),
    packageIds: z.array(z.number()).default([]),
}).refine((data) => data.serviceIds.length > 0 || data.packageIds.length > 0, {
    message: "At least one service or package must be selected",
    path: ["serviceIds"],
});

export type BookingSchema = z.infer<typeof bookingSchema>;
