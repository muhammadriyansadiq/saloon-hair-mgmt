import { apiClient } from '@/shared/api/client';
import { ServiceFilters, ServiceListResponse, ServiceResponse } from '../types';

export const serviceApi = {
    getServices: async (params?: ServiceFilters) => {
        const response = await apiClient.get<ServiceListResponse>('/services', { params });
        return response.data;
    },

    getServiceById: async (id: number) => {
        const response = await apiClient.get<ServiceResponse>(`/services/${id}`);
        return response.data;
    },

    createService: async (data: any) => {
        const response = await apiClient.post<ServiceResponse>('/services', data);
        return response.data;
    },

    updateService: async (id: number, data: any) => {
        const response = await apiClient.put<ServiceResponse>(`/services/${id}`, data);
        return response.data;
    },

    deleteService: async (id: number) => {
        const response = await apiClient.delete<{ message: string; success: boolean }>(`/services/${id}`);
        return response.data;
    }
};
