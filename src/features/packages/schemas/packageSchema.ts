import { z } from 'zod';

export const packageSchema = z.object({
    packageName: z.string().min(1, "Package name is required"),
    totalPrice: z.number().min(0, "Total price must be non-negative"),
    discountedPrice: z.number().min(0, "Discounted price must be non-negative"),
    totalDuration: z.string().min(1, "Duration is required"),
    serviceIds: z.array(z.number()).min(1, "At least one service is required"),
});

export type PackageSchema = z.infer<typeof packageSchema>;
