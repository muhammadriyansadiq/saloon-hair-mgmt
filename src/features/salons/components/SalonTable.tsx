import { Table, Button, Popconfirm, Tag, Avatar } from 'antd';
import { Edit, Trash2, Store } from 'lucide-react';
import { Salon } from '../types';

interface SalonTableProps {
    data: Salon[];
    loading: boolean;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
        onChange: (page: number, pageSize: number) => void;
    };
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export const SalonTable = ({ data, loading, pagination, onEdit, onDelete }: SalonTableProps) => {
    const columns = [
        {
            title: 'Salon',
            key: 'salon',
            render: (_: any, record: Salon) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        icon={<Store size={16} />}
                        size={40}
                        className="bg-blue-100 text-blue-600"
                    />
                    <div>
                        <div className="font-medium text-gray-900">{record.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{record.description}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Associated Barber',
            key: 'barber',
            render: (_: any, record: Salon) => (
                record.barber ? (
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">{record.barber.name}</span>
                    </div>
                ) : <span className="text-gray-400 text-xs">No Barber</span>
            ),
        },
        {
            title: 'Timings ID',
            dataIndex: 'timingsId',
            key: 'timingsId',
            className: 'text-gray-600',
        },
        {
            title: 'Booking Status',
            key: 'status',
            render: (_: any, record: Salon) => (
                <Tag color={record.isBookingClosed ? "red" : "success"} className="w-fit">
                    {record.isBookingClosed ? "Closed" : "Open"}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Salon) => (
                <div className="flex gap-2">
                    <Button
                        icon={<Edit size={16} />}
                        onClick={() => onEdit(record.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-none shadow-none"
                    />
                    <Popconfirm
                        title="Delete Salon"
                        description="Are you sure you want to delete this salon?"
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
