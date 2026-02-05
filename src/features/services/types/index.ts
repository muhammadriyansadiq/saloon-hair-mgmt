import { Barber } from '@/features/barbers/types';

export interface Service {
    id: number;
    name: string;
    description?: string;
    duration: string;
    basePrice: number;
    discountPrice?: number;
    premiumPrice?: number;
    barbersId: number[];
    barbers?: Barber[]; // Populated barbers
    createdAt?: string;
    updatedAt?: string;
}

export interface ServiceFilters {
    search?: string;
    page?: number;
    limit?: number;
}

export interface ServiceListResponse {
    data: Service[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    message: string;
    success: boolean;
}

export interface ServiceResponse {
    data: Service;
    message: string;
    success: boolean;
}
