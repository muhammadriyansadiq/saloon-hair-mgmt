import React from 'react';
import { CheckCircleOutlined, PlayCircleOutlined, CalendarOutlined } from '@ant-design/icons';

const QuickActions: React.FC = () => {
    return (
        <div className="bg-background-white rounded-card p-5 card-shadow">
            <h3 className="text-base font-semibold text-text-primary mb-4">
                Quick Action
            </h3>
            <div className="space-y-3">
                <button className="w-full bg-success hover:bg-success/90 text-white py-3 px-4 rounded-button font-medium flex items-center justify-center gap-2 transition-colors">
                    <PlayCircleOutlined />
                    Start Services
                </button>
                <button className="w-full bg-warning hover:bg-warning/90 text-white py-3 px-4 rounded-button font-medium flex items-center justify-center gap-2 transition-colors">
                    <CheckCircleOutlined />
                    Complete Services
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-button font-medium flex items-center justify-center gap-2 transition-colors">
                    <CalendarOutlined />
                    Book Appointment
                </button>
            </div>
        </div>
    );
};

export default QuickActions;
