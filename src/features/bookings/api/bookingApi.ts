
import { apiClient } from "@/shared/api/client";
import { BookingFilters, BookingListResponse, BookingResponse } from "../types";

export const bookingApi = {
    getBookings: async (params?: BookingFilters) => {
        const response = await apiClient.get<BookingListResponse>('/bookings', { params });
        return response.data;
    },

    getBookingById: async (id: number) => {
        const response = await apiClient.get<BookingResponse>(`/bookings/${id}`);
        return response.data;
    },

    createBooking: async (data: any) => {
        const response = await apiClient.post<BookingResponse>('/bookings', data);
        return response.data;
    },

    updateBooking: async (id: number, data: any) => {
        const response = await apiClient.put<BookingResponse>(`/bookings/${id}`, data);
        return response.data;
    },

    deleteBooking: async (id: number) => {
        const response = await apiClient.delete(`/bookings/${id}`);
        return response.data;
    }
};
