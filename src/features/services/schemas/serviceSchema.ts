import { z } from 'zod';

export const serviceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    duration: z.string().min(1, "Duration is required"), // e.g., "1 Hours"
    basePrice: z.coerce.number().min(0, "Base price must be positive"),
    discountPrice: z.coerce.number().min(0).optional(),
    premiumPrice: z.coerce.number().min(0).optional(),
    barbersId: z.array(z.number()).min(1, "At least one barber is required"),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;
