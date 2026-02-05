import { z } from 'zod';

export const barberSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    shiftId: z.coerce.number().min(1, "Shift is required"),
    isPremium: z.boolean().default(false),
    isAvailable: z.boolean().default(true),
    // Picture validation is handled at the component level mostly, but we define it here loosely
    picture: z.any().optional(),
});

export type BarberSchema = z.infer<typeof barberSchema>;
