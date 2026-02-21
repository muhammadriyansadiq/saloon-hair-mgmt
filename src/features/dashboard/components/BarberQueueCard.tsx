// import React from 'react';
// import { QueueItem } from '../types/dashboard.types';

// interface QueueItemCardProps {
//     item: QueueItem;
// }

// const QueueItemCard: React.FC<QueueItemCardProps> = ({ item }) => {
//     return (
//         <div className="bg-white border border-gray-100 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex justify-between items-start mb-3">
//                 <div className="flex flex-col">
//                     <span className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-0.5">Active</span>
//                     <div className="flex justify-between items-center w-full">
//                         <p className="text-sm font-bold text-text-primary whitespace-nowrap">{item.tokenNo}</p>
//                         <p className="text-sm font-semibold text-text-primary ml-auto">{item.clientName}</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="mb-3">
//                 <p className="text-xs text-text-secondary font-medium">{item.services}</p>
//             </div>

//             {item.buttonText && (
//                 <button
//                     className={`w-full py-2.5 px-4 rounded-button text-xs font-semibold tracking-wide ${item.buttonColor} text-white shadow-sm hover:opacity-90 active:scale-95 transition-all`}
//                 >
//                     {item.buttonText}
//                 </button>
//             )}
//         </div>
//     );
// };

// interface BarberQueueCardProps {
//     barberName: string;
//     activeItems: QueueItem[];
//     pendingItems: QueueItem[];
// }

// const BarberQueueCard: React.FC<BarberQueueCardProps> = ({
//     barberName,
//     activeItems,
//     pendingItems
// }) => {
//     return (
//         <div className="bg-white rounded-card p-6 card-shadow h-full flex flex-col">
//             <h3 className="text-lg font-bold text-text-primary mb-6">
//                 Barber: {barberName}
//             </h3>

//             {/* Active Section */}
//             <div className="mb-6 flex-1">
//                 <div className="flex items-center gap-2 mb-3">
//                     {/* Using a dot indicator */}
//                     <span className="relative flex h-2.5 w-2.5">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-opacity-75 bg-success"></span>
//                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
//                     </span>
//                     <p className="text-sm font-bold text-text-primary">Active</p>
//                 </div>
//                 {activeItems.length > 0 ? (
//                     activeItems.map((item, index) => (
//                         <QueueItemCard key={index} item={item} />
//                     ))
//                 ) : (
//                     <div className="text-sm text-text-secondary italic">No active clients</div>
//                 )}
//             </div>

//             {/* Pending Section */}
//             <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-3">
//                     <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
//                     <p className="text-sm font-bold text-text-primary">Pending</p>
//                 </div>
//                 {pendingItems.length > 0 ? (
//                     pendingItems.map((item, index) => (
//                         <QueueItemCard key={index} item={item} />
//                     ))
//                 ) : (
//                     <div className="text-sm text-text-secondary italic">No pending clients</div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default BarberQueueCard;
import React from 'react';

interface QueueItemProps {
    statusLabel?: string;
    tokenNo: string;
    customerName: string;
    services: string;
    actionLabel: string;
    onAction?: () => void;
    actionVariant?: 'blue' | 'green';
}

const QueueItem: React.FC<QueueItemProps> = ({
    statusLabel,
    tokenNo,
    customerName,
    services,
    actionLabel,
    onAction,
    actionVariant = 'blue'
}) => {
    const btnClass = actionVariant === 'blue'
        ? "bg-blue-50 text-blue-500 hover:bg-blue-100"
        : "bg-green-50 text-green-500 hover:bg-green-100";

    return (
        <div className="  mt-2 last:mb-0 rounded-lg p-2 shadow-queue-card">
            {statusLabel && (
                <div className="mb-2">
                    <span className={`text-sm font-bold text-gray-900`}>
                        {statusLabel}
                    </span>
                </div>
            )}
            <div className="h-px bg-gray-100 w-full mb-3" />

            <div className="flex justify-between items-start mb-3">
                <div className="text-xs text-textColor space-y-2">
                    <p><span className="text-textColor font-normal">Tokens No:</span> <span className="text-textColor  font-semibold">{tokenNo}</span></p>
                    <p><span className="text-textColor font-normal ">Services:</span> <span className="text-textColor font-semibold">{services}</span></p>
                </div>
                <div className="text-xs font-bold text-gray-900 text-right">
                    {customerName}
                </div>
            </div>

            <button
                onClick={onAction}
                className={`w-full py-2 rounded-md text-xs font-semibold transition-colors ${btnClass}`}
            >
                {actionLabel}
            </button>
        </div>
    );
};

interface BarberQueueCardProps {
    barberName: string;
    activeQueue: {
        tokenNo: string;
        customerName: string;
        services: string;
    };
    pendingQueue: {
        tokenNo: string;
        customerName: string;
        services: string;
    };
}

const BarberQueueCard: React.FC<BarberQueueCardProps> = ({
    barberName,
    activeQueue: _activeQueue,
    pendingQueue
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm  p-4 min-w-[289px]">
            <h3 className="font-bold text-sm text-gray-900 mb-3 pb-2 border-b border-gray-100">
                Barber: <span className="font-normal">{barberName}</span>
            </h3>

            <div className="flex flex-col  gap-2">
                {/* Active Section */}
                {/* <QueueItem
                    statusLabel="Active"
                    tokenNo={activeQueue.tokenNo}
                    customerName={activeQueue.customerName}
                    services={activeQueue.services}
                    actionLabel="Complete"
                    actionVariant="blue"
                /> */}

                {/* Pending Section - Divider? */}
                {/* <div className="h-px bg-gray-100 w-full" /> */}
                <QueueItem
                    statusLabel="Pending"
                    tokenNo={pendingQueue.tokenNo}
                    customerName={pendingQueue.customerName}
                    services={pendingQueue.services}
                    actionLabel={pendingQueue.tokenNo ? "Start Due" : "Start Services"}
                    actionVariant="green"
                /> <QueueItem
                    statusLabel="Pending"
                    tokenNo={pendingQueue.tokenNo}
                    customerName={pendingQueue.customerName}
                    services={pendingQueue.services}
                    actionLabel={pendingQueue.tokenNo ? "Start Due" : "Start Services"}
                    actionVariant="green"
                />
                <QueueItem
                    statusLabel="Pending"
                    tokenNo={pendingQueue.tokenNo}
                    customerName={pendingQueue.customerName}
                    services={pendingQueue.services}
                    actionLabel={pendingQueue.tokenNo ? "Start Due" : "Start Services"}
                    actionVariant="green"
                />
            </div>
        </div>
    );
};

export default BarberQueueCard;
