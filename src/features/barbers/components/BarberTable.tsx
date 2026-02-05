import { Table, Button, Popconfirm, Tag, Avatar } from 'antd';
import { Edit, Trash2, User } from 'lucide-react';
import { Barber } from '../types';

interface BarberTableProps {
    data: Barber[];
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

export const BarberTable = ({ data, loading, pagination, onEdit, onDelete }: BarberTableProps) => {
    const columns = [
        {
            title: 'Barber',
            key: 'barber',
            render: (_: any, record: Barber) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={record.picture}
                        icon={<User size={16} />}
                        size={40}
                        className="bg-gray-200"
                    />
                    <div>
                        <div className="font-medium text-gray-900">{record.name}</div>
                        <div className="text-xs text-gray-500">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            className: 'text-gray-600',
        },
        {
            title: 'Shift',
            key: 'shift',
            render: (_: any, record: Barber) => (
                record.shift ? (
                    <div>
                        <div className="font-medium text-xs text-gray-900 capitalize">{record.shift.title}</div>
                        <div className="text-xs text-xs text-gray-500">
                            {record.shift.startTime} {record.shift.startTimeAmPm} - {record.shift.endTime} {record.shift.endTimeAmPm}
                        </div>
                    </div>
                ) : <span className="text-gray-400 text-xs">No Shift</span>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_: any, record: Barber) => (
                <div className="flex flex-col gap-1">
                    {record.isAvailable ?
                        <Tag color="success" className="w-fit text-xs">Available</Tag> :
                        <Tag color="default" className="w-fit text-xs">Unavailable</Tag>
                    }
                    {record.isPremium && <Tag color="gold" className="w-fit text-xs">Premium</Tag>}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Barber) => (
                <div className="flex gap-2">
                    <Button
                        icon={<Edit size={16} />}
                        onClick={() => onEdit(record.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-none shadow-none"
                    />
                    <Popconfirm
                        title="Delete Barber"
                        description="Are you sure you want to delete this barber?"
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
