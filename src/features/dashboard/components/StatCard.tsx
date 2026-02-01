import React from 'react';
import { StatCardProps } from '../types/dashboard.types';

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    bgColor,
    icon,
    badge,
    textColor = 'text-white'
}) => {
    // Determine specific styles based on bg color for a more premium look
    const isDark = bgColor.includes('dark') || bgColor.includes('black');

    return (
        <div
            className={`${bgColor} ${textColor} rounded-card p-6 card-shadow relative overflow-hidden transition-transform duration-300 hover:-translate-y-1`}
        >
            {/* Background decoration for premium feel */}
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white opacity-10 blur-2xl pointer-events-none"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className={`text-sm font-medium ${isDark ? 'opacity-70' : 'opacity-90'}`}>{title}</h3>
                {badge && (
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                        {badge}
                    </span>
                )}
            </div>
            <div className="flex justify-between items-end relative z-10">
                <p className="text-3xl font-bold tracking-tight">{value}</p>
                {icon && <div className="text-3xl opacity-80">{icon}</div>}
            </div>
        </div>
    );
};

export default StatCard;
