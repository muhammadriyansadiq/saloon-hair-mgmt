import React from 'react';
import { BellOutlined, MenuOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

interface HeaderProps {
    title: string;
    collapsed?: boolean;
    onToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, collapsed, onToggle }) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4 ">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggle}
                        className="text-text-secondary hover:text-text-primary focus:outline-none"
                    >
                        {/* Mobile Menu Icon */}
                        <MenuOutlined className="lg:hidden text-lg" />

                        {/* Desktop Toggle Icons */}
                        <span className="hidden lg:block text-lg">
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </span>
                    </button>
                    <h1 className="text-xl font-semibold text-text-primary lg:block hidden">{title}</h1>
                </div>

                <div className="flex items-center gap-6">
                    <span className="text-sm text-text-secondary hidden lg:block">{currentDate}</span>
                    <button className="text-text-secondary hover:text-text-primary relative">
                        <BellOutlined className="text-xl" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Avatar
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mert"
                            size={40}
                        />
                        <div className="text-sm">
                            <p className="font-semibold text-text-primary">Mert Roy</p>
                            <p className="text-xs text-text-secondary">Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
