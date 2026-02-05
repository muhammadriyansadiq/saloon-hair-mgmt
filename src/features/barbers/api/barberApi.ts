import { apiClient } from '@/shared/api/client';
import { BarberFilters, BarberListResponse, BarberResponse } from '../types';

export const barberApi = {
    getBarbers: async (params?: BarberFilters) => {
        const response = await apiClient.get<BarberListResponse>('/barbers', { params });
        return response.data;
    },

    getBarberById: async (id: number) => {
        const response = await apiClient.get<BarberResponse>(`/barbers/${id}`);
        return response.data;
    },

    createBarber: async (data: FormData) => {
        const response = await apiClient.post<BarberResponse>('/barbers', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateBarber: async (id: number, data: FormData) => {
        const response = await apiClient.put<BarberResponse>(`/barbers/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteBarber: async (id: number) => {
        const response = await apiClient.delete<{ message: string; success: boolean }>(`/barbers/${id}`);
        return response.data;
    }
};
