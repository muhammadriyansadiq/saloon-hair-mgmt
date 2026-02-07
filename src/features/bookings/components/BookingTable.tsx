
import { Table, Button, Popconfirm, Tag, Avatar } from 'antd';
import { Edit, Trash2, CalendarCheck, User, Scissors, Gift, UserCircle } from 'lucide-react';
import { Booking } from '../types';
import dayjs from 'dayjs';

interface BookingTableProps {
    data: Booking[];
    loading: boolean;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
        onChange: (page: number, pageSize: number) => void;
    };
    onEdit: (booking: Booking) => void;
    onDelete: (id: number) => void;
}

export const BookingTable = ({ data, loading, pagination, onEdit, onDelete }: BookingTableProps) => {
    const columns = [
        {
            title: 'Token',
            dataIndex: 'token',
            key: 'token',
            render: (token: string) => (
                <div className="flex items-center gap-2">
                    <CalendarCheck size={16} className="text-gray-400" />
                    <span className="font-medium text-gray-900">{token}</span>
                </div>
            ),
        },
        {
            title: 'Customer',
            key: 'user',
            render: (_: any, record: Booking) => (
                <div className="flex items-center gap-2">
                    <Avatar icon={<UserCircle size={16} />} size="small" className="bg-orange-100 text-orange-600" />
                    <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">{record.user?.username}</span>
                        <span className="text-xs text-gray-500">{record.user?.phone}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Barber',
            key: 'barber',
            render: (_: any, record: Booking) => (
                <div className="flex items-center gap-2">
                    <Avatar icon={<User size={16} />} size="small" className="bg-blue-100 text-blue-600" />
                    <span className="text-gray-700">{record.barber?.name}</span>
                </div>
            ),
        },
        {
            title: 'Services',
            key: 'services',
            render: (_: any, record: Booking) => (
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {record.services?.map(service => (
                        <Tag key={service.id} icon={<Scissors size={10} />} color="cyan" className="mr-0 text-xs flex items-center gap-1">
                            {service.name}
                        </Tag>
                    ))}
                    {record.packages?.map(pkg => (
                        <Tag key={pkg.id} icon={<Gift size={10} />} color="purple" className="mr-0 text-xs flex items-center gap-1">
                            {pkg.packageName}
                        </Tag>
                    ))}
                    {!record.services?.length && !record.packages?.length && (
                        <span className="text-gray-400 text-xs">No items</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_: any, record: Booking) => (
                <Tag color={record.status === 'Active' ? 'success' : 'default'}>
                    {record.status}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => <span className="text-gray-500 text-sm">{dayjs(date).format('MMM D, YYYY h:mm A')}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Booking) => (
                <div className="flex gap-2">
                    <Button
                        icon={<Edit size={16} />}
                        onClick={() => onEdit(record)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-none shadow-none"
                    />
                    <Popconfirm
                        title="Delete Booking"
                        description="Are you sure you want to delete this booking?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ className: 'bg-red-500' }}
                    >
                        <Button
                            icon={<Trash2 size={16} />}
                            danger
                            className="border-none shadow-none hover:bg-red-50"
                        />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="overflow-x-auto">
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: pagination.onChange,
                    className: "mt-4"
                }}
                className="border border-gray-100 rounded-lg whitespace-nowrap"
            />
        </div>
    );
};
