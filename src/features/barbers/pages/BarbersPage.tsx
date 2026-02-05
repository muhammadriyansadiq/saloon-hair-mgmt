import { useState } from 'react';
import { Button, Input, message } from 'antd';
import { Plus, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { barberApi } from '../api/barberApi';
import { BarberTable } from '../components/BarberTable';
import { CreateBarberModal } from '../components/CreateBarberModal';
import { EditBarberModal } from '../components/EditBarberModal';

const BarbersPage = () => {
    const queryClient = useQueryClient();

    // State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');

    // Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Queries
    const { data: barbersData, isLoading } = useQuery({
        queryKey: ['barbers', page, pageSize, search],
        queryFn: () => barberApi.getBarbers({
            page,
            limit: pageSize,
            search,
        }),
    });

    // Mutations
    const deleteMutation = useMutation({
        mutationFn: barberApi.deleteBarber,
        onSuccess: () => {
            message.success('Barber deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['barbers'] });
        },
        onError: () => {
            message.error('Failed to delete barber');
        }
    });

    // Handlers
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                    <p className="text-gray-500">Manage barbers and their shifts</p>
                </div>
                <Button
                    type="primary"
                    icon={<Plus size={18} />}
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-primary hover:bg-primary/90 h-10 px-6 rounded-lg"
                >
                    Add Barber
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search barbers..."
                        value={search}
                        onChange={handleSearch}
                        className="pl-10 h-11 rounded-lg border-gray-200"
                    />
                </div>
            </div>

            <BarberTable
                data={barbersData?.data || []}
                loading={isLoading}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: barbersData?.total || 0,
                    onChange: (p, ps) => {
                        setPage(p);
                        setPageSize(ps);
                    },
                }}
                onEdit={(id) => setEditingId(id)}
                onDelete={(id) => deleteMutation.mutate(id)}
            />

            {/* Modals */}
            <CreateBarberModal
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            <EditBarberModal
                open={!!editingId}
                onClose={() => setEditingId(null)}
                barberId={editingId}
            />
        </div>
    );
};

export default BarbersPage;
