import { Modal, Button, Select } from 'antd';
import { useState } from 'react';
import { DayOfWeek } from '../types';

interface TimingFiltersModalProps {
    open: boolean;
    onClose: () => void;
    onApply: (filters: { day?: DayOfWeek }) => void;
    currentFilters: { day?: DayOfWeek };
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => ({ label: d, value: d }));

export const TimingFiltersModal = ({ open, onClose, onApply, currentFilters }: TimingFiltersModalProps) => {
    const [day, setDay] = useState<DayOfWeek | undefined>(currentFilters.day);

    const handleApply = () => {
        onApply({ day });
        onClose();
    };

    const handleClear = () => {
        setDay(undefined);
        onApply({ day: undefined });
        onClose();
    };

    return (
        <Modal
            title="Filter Timings"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="clear" onClick={handleClear}>Clear Filters</Button>,
                <Button key="apply" type="primary" onClick={handleApply} className="bg-primary">
                    Apply Filters
                </Button>
            ]}
        >
            <div className="flex flex-col gap-4 py-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                    <Select
                        className="w-full"
                        placeholder="Select Day"
                        options={DAYS}
                        value={day}
                        onChange={setDay}
                        allowClear
                    />
                </div>
            </div>
        </Modal>
    );
};
