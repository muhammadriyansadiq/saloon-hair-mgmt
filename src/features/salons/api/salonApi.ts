import { apiClient } from '@/shared/api/client';
import { SalonFilters, SalonListResponse, SalonResponse } from '../types';

export const salonApi = {
    getSalons: async (params?: SalonFilters) => {
        const response = await apiClient.get<SalonListResponse>('/salons', { params });
        return response.data;
    },

    getSalonById: async (id: number) => {
        const response = await apiClient.get<SalonResponse>(`/salons/${id}`);
        return response.data;
    },

    createSalon: async (data: any) => {
        const response = await apiClient.post<SalonResponse>('/salons', data);
        return response.data;
    },

    updateSalon: async (id: number, data: any) => {
        const response = await apiClient.put<SalonResponse>(`/salons/${id}`, data);
        return response.data;
    },

    deleteSalon: async (id: number) => {
        const response = await apiClient.delete<{ message: string; success: boolean }>(`/salons/${id}`);
        return response.data;
    }
};
