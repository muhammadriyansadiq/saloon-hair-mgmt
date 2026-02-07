import { Service } from "@/features/services/types";

export interface Package {
    id: number;
    packageName: string;
    totalPrice: number;
    discountedPrice: number;
    totalDuration: string;
    services: Service[];
    serviceIds?: number[];
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PackageFilters {
    search?: string;
    page?: number;
    limit?: number;
}

export interface PackageListResponse {
    data: Package[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    message: string;
    success: boolean;
}

export interface PackageResponse {
    data: Package;
    message: string;
    success: boolean;
}
