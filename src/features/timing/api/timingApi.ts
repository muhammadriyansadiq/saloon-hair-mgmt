import { apiClient } from '@/shared/api/client';
import { TimingFilters, TimingListResponse, TimingPayload, TimingResponse } from '../types';

export const timingApi = {
    getTimings: async (filters: TimingFilters) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.day) params.append('day', filters.day);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await apiClient.get<TimingListResponse>(`/timing?${params.toString()}`);
        return response.data;
    },

    getTimingById: async (id: string) => {
        const response = await apiClient.get<TimingResponse>(`/timing/${id}`);
        return response.data;
    },

    createTiming: async (data: TimingPayload) => {
        const response = await apiClient.post<TimingResponse>('/timing', data);
        return response.data;
    },

    updateTiming: async (id: string, data: TimingPayload) => {
        const response = await apiClient.put<TimingResponse>(`/timing/${id}`, data);
        return response.data;
    },

    deleteTiming: async (id: string) => {
        const response = await apiClient.delete<TimingResponse>(`/timing/${id}`);
        return response.data;
    }
};
