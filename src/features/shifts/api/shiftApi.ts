import { apiClient } from '@/shared/api/client';
import { Shift, ShiftPayload, ShiftListResponse, ShiftResponse, ShiftFilters } from '../types';

export const shiftApi = {
    getShifts: async (params?: ShiftFilters) => {
        const response = await apiClient.get<ShiftListResponse>('/shifts', { params });
        return response.data;
    },

    getShiftById: async (id: string) => {
        const response = await apiClient.get<ShiftResponse>(`/shifts/${id}`);
        return response.data;
    },

    createShift: async (data: ShiftPayload) => {
        const response = await apiClient.post<ShiftResponse>('/shifts', data);
        return response.data;
    },

    updateShift: async (id: string, data: ShiftPayload) => {
        const response = await apiClient.put<ShiftResponse>(`/shifts/${id}`, data);
        return response.data;
    },

    deleteShift: async (id: string) => {
        const response = await apiClient.delete<{ message: string }>(`/shifts/${id}`);
        return response.data;
    }
};
