import { Modal, Button, Radio } from 'antd';
import { useState } from 'react';
import { DayOfWeek } from '../types';

interface ShiftFiltersModalProps {
    open: boolean;
    onClose: () => void;
    onApply: (filters: { day?: DayOfWeek }) => void;
    currentFilters: { day?: DayOfWeek };
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const ShiftFiltersModal = ({ open, onClose, onApply, currentFilters }: ShiftFiltersModalProps) => {
    const [selectedDay, setSelectedDay] = useState<DayOfWeek | undefined>(currentFilters.day);

    const handleApply = () => {
        onApply({ day: selectedDay });
        onClose();
    };

    const handleClear = () => {
        setSelectedDay(undefined);
        onApply({ day: undefined });
        onClose();
    };

    return (
        <Modal
            title="Filter Shifts"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="clear" onClick={handleClear}>
                    Clear Filters
                </Button>,
                <Button key="apply" type="primary" onClick={handleApply} className="bg-primary hover:bg-primary/90">
                    Apply Filters
                </Button>,
            ]}
            width={400}
            centered
        >
            <div className="py-4">
                <h3 className="font-medium mb-3">Filter by Day</h3>
                <Radio.Group
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="flex flex-col gap-2"
                >
                    {DAYS.map(day => (
                        <Radio key={day} value={day}>{day}</Radio>
                    ))}
                </Radio.Group>
            </div>
        </Modal>
    );
};
