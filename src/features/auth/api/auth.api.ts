import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { LoginFormData, LoginResponse } from '../types/auth.types';

export const login = async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
};

export const useLogin = () => {
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            // You might want to store user info in a global state store (like Zustand or Context) here
        },
    });
};
