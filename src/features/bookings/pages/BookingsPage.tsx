
import { useState } from 'react';
import { Button, Input, message } from 'antd';
import { Plus, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { BookingTable } from '../components/BookingTable';
import { CreateBookingModal } from '../components/CreateBookingModal';
import { EditBookingModal } from '../components/EditBookingModal';

export const BookingsPage = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data: bookingsData, isLoading } = useQuery({
        queryKey: ['bookings', page, pageSize, search],
        queryFn: () => bookingApi.getBookings({
            page,
            limit: pageSize,
            search,
        }),
    });

    const deleteMutation = useMutation({
        mutationFn: bookingApi.deleteBooking,
        onSuccess: () => {
            message.success('Booking deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
        onError: () => {
            message.error('Failed to delete booking');
        }
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                    <p className="text-gray-500">Manage customer appointments and reservations</p>
                </div>
                <Button
                    type="primary"
                    icon={<Plus size={18} />}
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-primary hover:bg-primary/90 h-10 px-6 rounded-lg"
                >
                    Create Booking
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search bookings..."
                        value={search}
                        onChange={handleSearch}
                        className="pl-3 h-11 rounded-lg border-gray-200"
                    />
                </div>
            </div>

            <BookingTable
                data={bookingsData?.data || []}
                loading={isLoading}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: bookingsData?.total || 0,
                    onChange: (p, ps) => {
                        setPage(p);
                        setPageSize(ps);
                    },
                }}
                onEdit={(booking) => setEditingId(booking.id)}
                onDelete={(id) => deleteMutation.mutate(id)}
            />

            <CreateBookingModal
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            <EditBookingModal
                open={!!editingId}
                bookingId={editingId}
                onClose={() => setEditingId(null)}
            />
        </div>
    );
};
