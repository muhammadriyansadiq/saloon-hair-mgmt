import { Table, Button, Popconfirm, Tag } from 'antd';
import { Edit, Trash2 } from 'lucide-react';
import { Service } from '../types';

interface ServiceTableProps {
    data: Service[];
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

export const ServiceTable = ({ data, loading, pagination, onEdit, onDelete }: ServiceTableProps) => {
    const columns = [
        {
            title: 'Service Name',
            dataIndex: 'name',
            key: 'name',
            className: 'font-medium text-gray-900',
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            className: 'text-gray-600',
        },
        {
            title: 'Prices',
            key: 'prices',
            render: (_: any, record: Service) => (
                <div className="flex flex-col gap-1 text-xs">
                    <span className="text-gray-900 font-medium">Base: ${record.basePrice}</span>
                    {record.discountPrice && <span className="text-green-600">Discount: ${record.discountPrice}</span>}
                    {record.premiumPrice && <span className="text-amber-600">Premium: ${record.premiumPrice}</span>}
                </div>
            ),
        },
        {
            title: 'Barbers',
            key: 'barbers',
            render: (_: any, record: Service) => (
                <div className="flex flex-wrap gap-1">
                    {record.barbers && record.barbers.length > 0 ? (
                        record.barbers.map(barber => (
                            <Tag key={barber.id} className="mr-0">{barber.name}</Tag>
                        ))
                    ) : (
                        <span className="text-gray-400 text-xs">No Barbers</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Service) => (
                <div className="flex gap-2">
                    <Button
                        icon={<Edit size={16} />}
                        onClick={() => onEdit(record.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-none shadow-none"
                    />
                    <Popconfirm
                        title="Delete Service"
                        description="Are you sure you want to delete this service?"
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
