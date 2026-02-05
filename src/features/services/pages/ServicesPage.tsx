import { useState } from 'react';
import { Button, Input, message } from 'antd';
import { Plus, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '../api/serviceApi';
import { ServiceTable } from '../components/ServiceTable';
import { CreateServiceModal } from '../components/CreateServiceModal';
import { EditServiceModal } from '../components/EditServiceModal';

const ServicesPage = () => {
    const queryClient = useQueryClient();

    // State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');

    // Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Queries
    const { data: servicesData, isLoading } = useQuery({
        queryKey: ['services', page, pageSize, search],
        queryFn: () => serviceApi.getServices({
            page,
            limit: pageSize,
            search,
        }),
    });

    // Mutations
    const deleteMutation = useMutation({
        mutationFn: serviceApi.deleteService,
        onSuccess: () => {
            message.success('Service deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
        onError: () => {
            message.error('Failed to delete service');
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
                    <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
                    <p className="text-gray-500">Manage salon services and pricing</p>
                </div>
                <Button
                    type="primary"
                    icon={<Plus size={18} />}
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-primary hover:bg-primary/90 h-10 px-6 rounded-lg"
                >
                    Add Service
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search services..."
                        value={search}
                        onChange={handleSearch}
                        className="pl-10 h-11 rounded-lg border-gray-200"
                    />
                </div>
            </div>

            <ServiceTable
                data={servicesData?.data || []}
                loading={isLoading}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: servicesData?.total || 0,
                    onChange: (p, ps) => {
                        setPage(p);
                        setPageSize(ps);
                    },
                }}
                onEdit={(id) => setEditingId(id)}
                onDelete={(id) => deleteMutation.mutate(id)}
            />

            {/* Modals */}
            <CreateServiceModal
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            <EditServiceModal
                open={!!editingId}
                onClose={() => setEditingId(null)}
                serviceId={editingId}
            />
        </div>
    );
};

export default ServicesPage;
