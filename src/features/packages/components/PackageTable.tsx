import { Table, Button, Popconfirm, Tag, Avatar } from 'antd';
import { Edit, Trash2, Gift } from 'lucide-react';
import { Package } from '../types';

interface PackageTableProps {
    data: Package[];
    loading: boolean;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
        onChange: (page: number, pageSize: number) => void;
    };
    onEdit: (pkg: Package) => void;
    onDelete: (id: number) => void;
}

export const PackageTable = ({ data, loading, pagination, onEdit, onDelete }: PackageTableProps) => {
    const columns = [
        {
            title: 'Package',
            key: 'packageName',
            render: (_: any, record: Package) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        icon={<Gift size={16} />}
                        size={40}
                        className="bg-purple-100 text-purple-600"
                    />
                    <div>
                        <div className="font-medium text-gray-900">{record.packageName}</div>
                        <div className="text-xs text-gray-500">{record.totalDuration}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Included Services',
            key: 'services',
            render: (_: any, record: Package) => (
                <div className="flex flex-wrap gap-1">
                    {record.services && record.services.length > 0 ? (
                        record.services.map(service => (
                            <Tag key={service.id} className="mr-0">{service.name}</Tag>
                        ))
                    ) : (
                        <span className="text-gray-400 text-xs">No Services</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Standard Price',
            key: 'totalPrice',
            render: (_: any, record: Package) => (
                <span className="text-gray-500 line-through">
                    ${Number(record.totalPrice).toFixed(2)}
                </span>
            ),
        },
        {
            title: 'Discounted Price',
            key: 'discountedPrice',
            render: (_: any, record: Package) => (
                <span className="text-green-600 font-medium">
                    ${Number(record.discountedPrice).toFixed(2)}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Package) => (
                <div className="flex gap-2">
                    <Button
                        icon={<Edit size={16} />}
                        onClick={() => onEdit(record)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-none shadow-none"
                    />
                    <Popconfirm
                        title="Delete Package"
                        description="Are you sure you want to delete this package?"
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
