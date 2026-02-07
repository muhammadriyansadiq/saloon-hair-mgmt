import { apiClient } from '@/shared/api/client';
import { PackageFilters, PackageListResponse, PackageResponse } from '../types';

export const packageApi = {
    getPackages: async (params?: PackageFilters) => {
        const response = await apiClient.get<PackageListResponse>('/packages', { params });
        return response.data;
    },

    getPackageById: async (id: number) => {
        const response = await apiClient.get<PackageResponse>(`/packages/${id}`);
        return response.data;
    },

    createPackage: async (data: any) => {
        const response = await apiClient.post<PackageResponse>('/packages', data);
        return response.data;
    },

    updatePackage: async (id: number, data: any) => {
        const response = await apiClient.put<PackageResponse>(`/packages/${id}`, data);
        return response.data;
    },

    deletePackage: async (id: number) => {
        const response = await apiClient.delete<{ message: string; success: boolean }>(`/packages/${id}`);
        return response.data;
    }
};
