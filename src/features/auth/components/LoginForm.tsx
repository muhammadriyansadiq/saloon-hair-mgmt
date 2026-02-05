import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginSchema = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { mutate: login, isPending, error } = useLogin();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginSchema) => {
        login(data, {
            onSuccess: () => {
                navigate('/');
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm ">
            <div className="">
                {/* Username Field */}
                <div className=" mb-4">
                    <label
                        htmlFor="username"
                        className="text-sm font-semibold text-text-primary block mb-2"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.username ? 'border-danger' : 'border-gray-200'
                            } focus:outline-none focus:ring-2 focus:ring-primary-yellow/20 focus:border-primary-yellow transition-all duration-200 placeholder:text-gray-300 text-sm`}
                        {...register('username')}
                    />
                    {errors.username && (
                        <p className="text-xs text-danger">{errors.username.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="">
                    <label
                        htmlFor="password"
                        className="text-sm font-semibold text-text-primary block mb-2"
                    >
                        Create password*
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-danger' : 'border-gray-200'
                                } focus:outline-none focus:ring-2 focus:ring-primary-yellow/20 focus:border-primary-yellow transition-all duration-200 placeholder:text-gray-300 text-sm pr-10`}
                            {...register('password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text-primary transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-danger">{errors.password.message}</p>
                    )}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="text-xs text-gray-400 hover:text-text-primary transition-colors mt-2"
                    >
                        Forgot Password?
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-danger-light text-danger text-sm rounded-lg">
                    {error instanceof Error ? error.message : 'Login failed. Please try again.'}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary-yellow hover:bg-primary-orange text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed uppercase text-sm tracking-wide mt-6"
            >
                {isPending ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
    );
};

export default LoginForm;
