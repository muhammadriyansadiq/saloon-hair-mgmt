import { useState } from 'react';
import { Button, Input, message } from 'antd';
import { Plus, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packageApi } from '../api/packageApi';
import { PackageTable } from '../components/PackageTable';
import { CreatePackageModal } from '../components/CreatePackageModal';
import { EditPackageModal } from '../components/EditPackageModal';

export const PackagesPage = () => {
    const queryClient = useQueryClient();

    // State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');

    // Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Queries
    const { data: packagesData, isLoading } = useQuery({
        queryKey: ['packages', page, pageSize, search],
        queryFn: () => packageApi.getPackages({
            page,
            limit: pageSize,
            search,
        }),
    });

    // Mutations
    const deleteMutation = useMutation({
        mutationFn: packageApi.deletePackage,
        onSuccess: () => {
            message.success('Package deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['packages'] });
        },
        onError: () => {
            message.error('Failed to delete package');
        }
    });

    // Handlers
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Package Management</h1>
                    <p className="text-gray-500">Manage service packages and bundles</p>
                </div>
                <Button
                    type="primary"
                    icon={<Plus size={18} />}
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-primary hover:bg-primary/90 h-10 px-6 rounded-lg"
                >
                    Add Package
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search packages..."
                        value={search}
                        onChange={handleSearch}
                        className="pl-3 h-11 rounded-lg border-gray-200"
                    />
                </div>
            </div>

            <PackageTable
                data={packagesData?.data || []}
                loading={isLoading}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: packagesData?.total || 0,
                    onChange: (p, ps) => {
                        setPage(p);
                        setPageSize(ps);
                    },
                }}
                onEdit={(pkg) => setEditingId(pkg.id)}
                onDelete={(id) => deleteMutation.mutate(id)}
            />

            {/* Modals */}
            <CreatePackageModal
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            <EditPackageModal
                open={!!editingId}
                packageId={editingId}
                onClose={() => setEditingId(null)}
            />
        </div>
    );
};
