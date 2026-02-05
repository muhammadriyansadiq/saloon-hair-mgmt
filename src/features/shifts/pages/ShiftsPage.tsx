import { useState } from 'react';
import { Button, Input, message } from 'antd';
import { Plus, Search, Filter } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shiftApi } from '../api/shiftApi';
import { ShiftTable } from '../components/ShiftTable';
import { CreateShiftModal } from '../components/CreateShiftModal';
import { EditShiftModal } from '../components/EditShiftModal';
import { ShiftFiltersModal } from '../components/ShiftFiltersModal';
import { DayOfWeek } from '../types';

const ShiftsPage = () => {
    const queryClient = useQueryClient();

    // State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [dayFilter, setDayFilter] = useState<DayOfWeek | undefined>(undefined);

    // Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Queries
    const { data: shiftsData, isLoading } = useQuery({
        queryKey: ['shifts', page, pageSize, search, dayFilter],
        queryFn: () => shiftApi.getShifts({
            page,
            limit: pageSize,
            search,
            day: dayFilter,
        }),
    });

    // Mutations
    const deleteMutation = useMutation({
        mutationFn: shiftApi.deleteShift,
        onSuccess: () => {
            message.success('Shift deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['shifts'] });
        },
        onError: () => {
            message.error('Failed to delete shift');
        }
    });

    // Handlers
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page
    };

    const handleApplyFilters = (filters: { day?: DayOfWeek }) => {
        setDayFilter(filters.day);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Shift Management</h1>
                    <p className="text-gray-500">Manage staff working shifts</p>
                </div>
                <Button
                    type="primary"
                    icon={<Plus size={18} />}
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-primary hover:bg-primary/90 h-10 px-6 rounded-lg"
                >
                    Create Shift
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search shifts..."
                        value={search}
                        onChange={handleSearch}
                        className="pl-10 h-11 rounded-lg border-gray-200"
                    />
                </div>
                <Button
                    icon={<Filter size={18} />}
                    onClick={() => setIsFilterOpen(true)}
                    className="h-11 px-4 rounded-lg border-gray-200"
                >
                    Filters
                    {dayFilter && <span className="ml-2 w-2 h-2 rounded-full bg-primary inline-block" />}
                </Button>
            </div>

            <ShiftTable
                data={shiftsData?.data || []}
                loading={isLoading}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: shiftsData?.total || 0,
                    onChange: (p, ps) => {
                        setPage(p);
                        setPageSize(ps);
                    },
                }}
                onEdit={(id) => setEditingId(id)}
                onDelete={(id) => deleteMutation.mutate(id)}
            />

            {/* Modals */}
            <CreateShiftModal
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            <EditShiftModal
                open={!!editingId}
                onClose={() => setEditingId(null)}
                shiftId={editingId}
            />

            <ShiftFiltersModal
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={handleApplyFilters}
                currentFilters={{ day: dayFilter }}
            />
        </div>
    );
};

export default ShiftsPage;
