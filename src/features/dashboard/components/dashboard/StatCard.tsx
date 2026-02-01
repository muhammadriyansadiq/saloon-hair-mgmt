import React, { ReactNode } from 'react';
// Checking package.json, clsx and tailwind-merge are there. I'll assume lib/utils exists or just use template literals if simple.
// I will verify standard utils existence later, for now I will use standard concatenation or simple logic to be safe or create a local helper.

// Actually, I'll stick to template literals for simplicity unless complex.

interface StatCardProps {
    title: string;
    value: string;
    bgColor?: string; // e.g. "bg-yellow-400"
    textColor?: string; // e.g. "text-white"
    valueColor?: string; // If value needs different color e.g. green/red
    icon?: ReactNode;
    badge?: ReactNode;
    className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    bgColor = "bg-white",
    textColor = "text-black",
    valueColor,
    icon,
    badge,
    className,
}) => {
    return (
        <div className={`rounded-xl p-4 flex flex-col justify-between h-[120px] shadow-sm relative overflow-hidden ${bgColor} ${className}`}>

            {/* Title Section */}
            <div className="z-10 relative">
                <h3 className={`font-medium  border-b pb-5 inline-block w-full border-white/40 ${textColor}`}>
                    {title}
                </h3>
            </div>

            {/* Value Section */}
            <div className="flex justify-between items-end z-10 relative">
                <h3 className={` font-bold ${valueColor || textColor}`}>
                    {value}
                </h3>

                {/* Icon or Badge */}
                <div className="flex items-center gap-1">
                    {badge}
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
