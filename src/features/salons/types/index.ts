import { Barber } from '@/features/barbers/types';


export interface Salon {
    id: number;
    name: string;
    description: string;
    timingsId: number;
    barberId: number;
    barber?: Barber; // Optional populated field
    timings?: any; // To be typed properly if we have timing types available, using any for now or Shift? User said "timingsId", might refer to Shift or special Timing model. Sticking to ID for now.
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
