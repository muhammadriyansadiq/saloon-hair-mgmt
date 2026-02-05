import { useState } from 'react';
import { Button, Input, message } from 'antd';
import { Plus, Search, Filter } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timingApi } from '../api/timingApi';
import { TimingTable } from '../components/TimingTable';
import { CreateTimingModal } from '../components/CreateTimingModal';
import { EditTimingModal } from '../components/EditTimingModal';
import { TimingFiltersModal } from '../components/TimingFiltersModal';
import { DayOfWeek } from '../types';

const TimingPage = () => {
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
    const { data: timingsData, isLoading } = useQuery({
        queryKey: ['timings', page, pageSize, search, dayFilter],
        queryFn: () => timingApi.getTimings({
            page,
            limit: pageSize,
            search,
            day: dayFilter,
        }),
    });

    // Mutations
    const deleteMutation = useMutation({
        mutationFn: timingApi.deleteTiming,
        onSuccess: () => {
            message.success('Timing deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['timings'] });
        },
        onError: () => {
            message.error('Failed to delete timing');
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
                    <h1 className="text-2xl font-bold text-gray-900">Timing Management</h1>
                    <p className="text-gray-500">Manage salon opening hours and staff shifts</p>
                </div>
                <Button
                    type="primary"
                    icon={<Plus size={18} />}
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-primary hover:bg-primary/90 h-10 px-6 rounded-lg"
                >
                    Create Timing
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search timings..."
                        value={search}
                        onChange={handleSearch}
                        className="pl-4 h-11 rounded-lg border-gray-200"
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

            <TimingTable
                data={timingsData?.data || []}
                loading={isLoading}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: timingsData?.total || 0,
                    onChange: (p, ps) => {
                        setPage(p);
                        setPageSize(ps);
                    },
                }}
                onEdit={(id) => {
                    console.log('Edit clicked, ID:', id);
                    if (!id) console.error('ID is missing!');
                    setEditingId(id);
                }}
                onDelete={(id) => deleteMutation.mutate(id)}
            />

            {/* Modals */}
            <CreateTimingModal
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            <EditTimingModal
                open={!!editingId}
                onClose={() => setEditingId(null)}
                timingId={editingId}
            />

            <TimingFiltersModal
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={handleApplyFilters}
                currentFilters={{ day: dayFilter }}
            />
        </div>
    );
};

export default TimingPage;
