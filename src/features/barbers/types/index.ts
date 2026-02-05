import { Shift } from '@/features/shifts/types';

export interface Barber {
    id: number; // API returns number ID for barbers based on the example
    name: string;
    email: string;
    phone: string;
    picture: string;
    isAvailable: boolean;
    isPremium: boolean;
    shiftId: number;
    shift: Shift;
    status: 'Active' | 'Inactive';
    createdAt: string;
    updatedAt: string;
}

export interface BarberFilters {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
}

export interface BarberListResponse {
    data: Barber[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    message: string;
    success: boolean;
}

export interface BarberResponse {
    data: Barber;
    message: string;
    success: boolean;
}
