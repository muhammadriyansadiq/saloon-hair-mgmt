import { Barber } from '@/features/barbers/types';


export interface Salon {
    id: number;
    name: string;
    description: string;
    timingsId: number[];
    barberId: number[];
    barbers?: Barber[]; // Optional populated field
    timings?: any[]; // To be typed properly if we have timing types available
    isBookingClosed: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface SalonFilters {
    search?: string;
    page?: number;
    limit?: number;
}

export interface SalonListResponse {
    data: Salon[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    message: string;
    success: boolean;
}

export interface SalonResponse {
    data: Salon;
    message: string;
    success: boolean;
}
