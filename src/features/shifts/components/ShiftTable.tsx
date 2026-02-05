import { Table, Button, Popconfirm, Tag } from 'antd';
import { Edit, Trash2 } from 'lucide-react';
import { Shift } from '../types';

interface ShiftTableProps {
    data: Shift[];
    loading: boolean;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
        onChange: (page: number, pageSize: number) => void;
    };
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const ShiftTable = ({ data, loading, pagination, onEdit, onDelete }: ShiftTableProps) => {
    const columns = [
        {
            title: 'Day',
            dataIndex: 'day',
            key: 'day',
            render: (day: string) => <Tag color="geekblue">{day}</Tag>,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            className: 'font-medium capitalize',
        },
        {
            title: 'Shift Time',
            key: 'shiftTime',
            render: (_: any, record: Shift) => (
                <span>
                    {record.startTime} {record.startTimeAmPm} - {record.endTime} {record.endTimeAmPm}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Shift) => (
                <div className="flex gap-2">
                    <Button
                        icon={<Edit size={16} />}
                        onClick={() => onEdit(record.id || record._id!)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-none shadow-none"
                    />
                    <Popconfirm
                        title="Delete Shift"
                        description="Are you sure you want to delete this shift?"
                        onConfirm={() => onDelete(record.id || record._id!)}
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
                rowKey={(record) => record.id || record._id!}
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
