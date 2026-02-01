export interface StatCardProps {
    title: string;
    value: string | number;
    bgColor: string;
    icon?: React.ReactNode;
    badge?: string;
    textColor?: string;
}

export interface QueueItem {
    tokenNo: string;
    clientName: string;
    services: string;
    status: 'active' | 'pending';
    statusColor?: string;
    buttonText?: string;
    buttonColor?: string;
}

export interface BarberQueue {
    barberName: string;
    activeItems: QueueItem[];
    pendingItems: QueueItem[];
}

export interface PaymentDue {
    key: string;
    client: string;
    amount: number;
    status: 'due' | 'paid';
}
