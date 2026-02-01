import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PaymentDue } from '../types/dashboard.types';

const PaymentTable: React.FC = () => {
    const columns: ColumnsType<PaymentDue> = [
        {
            title: 'Client',
            dataIndex: 'client',
            key: 'client',
            render: (text) => <span className="font-medium text-text-primary">{text}</span>,
            className: 'pl-6',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => <span className="font-semibold text-text-primary">${amount}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: 'due' | 'paid') => (
                <Tag
                    color={status === 'paid' ? '#E8F5E9' : '#FFEBEE'}
                    style={{ color: status === 'paid' ? '#4CAF50' : '#FF5252', border: 0 }}
                    className="rounded-md px-3 py-1 font-semibold uppercase text-xs"
                >
                    {status === 'paid' ? 'Paid' : 'Due'}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <button className="text-text-secondary hover:text-primary-yellow font-medium text-sm transition-colors pr-6">
                    View
                </button>
            ),
            align: 'right',
        },
    ];

    const data: PaymentDue[] = [
        {
            key: '1',
            client: 'Ahmed khan',
            amount: 120,
            status: 'due',
        },
        {
            key: '2',
            client: 'Hamza Rizwan',
            amount: 95,
            status: 'due',
        },
        {
            key: '3',
            client: 'Musab',
            amount: 95,
            status: 'paid',
        },
        {
            key: '4',
            client: 'Raza',
            amount: 95,
            status: 'paid',
        },
    ];

    return (
        <div className="bg-white rounded-card p-6 card-shadow h-full">
            <h3 className="text-lg font-bold text-text-primary mb-6">
                Payment & Dues
            </h3>
            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    className="custom-table w-full"
                    rowClassName="hover:bg-gray-50 transition-colors"
                />
            </div>
            <style>{`
                .custom-table .ant-table-thead > tr > th {
                    background: #FFF8E1 !important; /* Light yellow header */
                    color: #1A1A1A !important;
                    font-weight: 600 !important;
                    border-bottom: 0 !important;
                }
                .custom-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #f0f0f0 !important;
                    padding: 16px 8px !important;
                }
                .custom-table .ant-table-container {
                    border-radius: 8px !important;
                }
            `}</style>
        </div>
    );
};

export default PaymentTable;
