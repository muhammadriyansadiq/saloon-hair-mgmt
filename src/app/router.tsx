
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/shared/components/Layout/MainLayout';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';

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
]);
