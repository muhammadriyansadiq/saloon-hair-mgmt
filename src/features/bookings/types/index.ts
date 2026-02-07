
import { Barber } from "../../barbers/types";
import { Service } from "../../services/types";
import { Package } from "../../packages/types";

export interface User {
    id: number;
    username: string;
    phone: string;
    email?: string;
}

export interface Booking {
    id: number;
    barberId: number;
    userId: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    token: string;
    barber: Barber;
    user: User;
    services: Service[];
    packages: Package[];
}

export interface BookingFilters {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
}

export interface BookingResponse {
    success: boolean;
    message: string;
    data: Booking;
}

export interface BookingListResponse {
    success: boolean;
    message: string;
    data: Booking[];
    page: number;
    total: number;
    lastPage: number;
}
