
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/shared/components/Layout/MainLayout';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import LoginPage from '@/features/auth/components/LoginPage';
import TimingPage from '@/features/timing/pages/TimingPage';
import ShiftsPage from '@/features/shifts/pages/ShiftsPage';
import BarbersPage from '@/features/barbers/pages/BarbersPage';
import SalonsPage from '@/features/salons/pages/SalonsPage';
import ServicesPage from '@/features/services/pages/ServicesPage';
import { PackagesPage } from '@/features/packages/pages/PackagesPage';
import { BookingsPage } from '@/features/bookings/pages/BookingsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: 'timing',
                element: <TimingPage />,
            },
            {
                path: 'shifts',
                element: <ShiftsPage />,
            },
            {
                path: 'barbers',
                element: <BarbersPage />,
            },
            {
                path: 'salon',
                element: <SalonsPage />,
            },
            {
                path: 'services',
                element: <ServicesPage />,
            },
            {
                path: 'packages',
                element: <PackagesPage />,
            },
            {
                path: 'bookings',
                element: <BookingsPage />,
            },
            {
                path: 'appointments',
                element: <div className="p-6">Appointments Page (Coming Soon)</div>,
            },
            {
                path: 'orders',
                element: <div className="p-6">Orders Page (Coming Soon)</div>,
            },
            {
                path: 'clients',
                element: <div className="p-6">Clients Page (Coming Soon)</div>,
            },
            {
                path: 'payments',
                element: <div className="p-6">Payments Page (Coming Soon)</div>,
            },
            {
                path: 'financial-summary',
                element: <div className="p-6">Financial Summary Page (Coming Soon)</div>,
            },
            {
                path: 'settings',
                element: <div className="p-6">Settings Page (Coming Soon)</div>,
            },
        ],
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
]);

