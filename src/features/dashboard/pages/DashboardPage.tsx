
import { Plus } from 'lucide-react';

import BarberQueueCard from '../components/BarberQueueCard';
import { Button } from 'antd';
import { useState } from 'react';
import { CreateBookingModal } from '@/features/bookings/components/CreateBookingModal';



const DashboardPage: React.FC = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Mock data for barber queues
    const queues = [
        {
            barberName: 'Shan',
            activeQueue: { tokenNo: '#24', customerName: 'Ahmed Khan', services: 'Haircut & Shave' },
            pendingQueue: { tokenNo: '#15', customerName: 'Hamza Rizwan', services: 'Haircut & Shave' }
        },
        {
            barberName: 'Ali',
            activeQueue: { tokenNo: '#24', customerName: 'Ehtisham', services: 'Haircut & Shave' },
            pendingQueue: { tokenNo: '#15', customerName: 'Arsalan', services: 'Haircut & Shave' }
        },
        {
            barberName: 'Ahmed',
            activeQueue: { tokenNo: '#24', customerName: 'Ehtisham', services: 'Haircut & Shave' },
            pendingQueue: { tokenNo: '#15', customerName: 'Arsalan', services: 'Haircut & Shave' }
        }
    ];


    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Todays Appointments"
                    value="12"
                    bgColor="bg-primary-yellow"
                    icon={<CalendarOutlined />}
                    textColor="text-white"
                />
                <StatCard
                    title="Action Tokens"
                    value="Token 05"
                    bgColor="bg-dark"
                    icon={<ThunderboltOutlined />}
                    textColor="text-white"
                />
                <StatCard
                    title="Todays Collections"
                    value="$8,950"
                    bgColor="bg-primary-yellow" // Assuming this is also yellow based on common design patterns, or maybe orange
                    badge="+1500" // Changed 10% to 1500 to match likely numeric value in design or just cleaner
                    icon={<DollarOutlined />}
                    textColor="text-white"
                />
                <StatCard
                    title="Pending Dues"
                    value="$450"
                    bgColor="bg-dark"
                    icon={<DollarOutlined />} // Maybe a different icon like FileText if avail
                    textColor="text-danger" // Red text for dues? Or keep white on black
                />
            </div> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title={stats.appointments.title}
                    value={stats.appointments.value}
                    bgColor="bg-[#F5BF4F]"
                    textColor="text-white"
                    icon={<Calendar size={20} className="opacity-80 text-white" />}
                />
                <StatCard
                    title={stats.tokens.title}
                    value={stats.tokens.value}
                    bgColor="bg-primary-blackjet"
                    textColor="text-white"
                />
                <StatCard
                    title={stats.collections.title}
                    value={stats.collections.value}
                    bgColor="bg-[#F5BF4F]"
                    textColor="text-white"
                    valueColor="text-[#2FB344]"
                    badge={
                        <div className="bg-white/40 px-1 py-0.5 rounded text-[10px] font-medium flex items-center gap-0.5 text-white">
                            <span className="text-[8px] transform -rotate-45">↗</span> {stats.collections.badge}
                        </div>
                    }
                />
                <StatCard
                    title={stats.dues.title}
                    value={stats.dues.value}
                    bgColor="bg-primary-blackjet"
                    textColor="text-white"
                    valueColor="text-red-500"
                />
            </div> */}
            {/* Barber Queues */}
            {/* <div>
                <h2 className="text-xl font-bold text-text-primary mb-6">
                    Barber Queues
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {barberQueues.map((queue, index) => (
                        <div key={index} className="h-full">
                            <BarberQueueCard
                                barberName={queue.barberName}
                                activeItems={queue.activeItems}
                                pendingItems={queue.pendingItems}
                            />
                        </div>
                    ))}
                </div>
            </div> */}
            <div>
                <div className="flex justify-between items-center gap-4  mb-8">
                    <h2 className="text-xl font-bold text-gray-800 ">Barber Queues</h2>

                    <Button
                        type="primary"
                        icon={<Plus size={18} />}
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-primary hover:bg-primary/90 h-10 px-6 rounded-lg "
                    >
                        Quick Booking
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {queues.map((queue, index) => (
                        <BarberQueueCard
                            key={index}
                            barberName={queue.barberName}
                            activeQueue={queue.activeQueue}
                            pendingQueue={queue.pendingQueue}
                        />
                    ))}
                </div>
            </div>
            {/* Payment & Dues + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* <div className="lg:col-span-2 h-full">
                    <PaymentTable />
                </div> */}
                {/* <div className="h-full">
                    <QuickActions />
                </div> */}
            </div>

            <CreateBookingModal
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </div>
    );
};

export default DashboardPage;
