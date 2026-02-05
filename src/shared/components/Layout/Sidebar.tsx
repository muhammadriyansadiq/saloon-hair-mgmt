import React from 'react';
import { Layout, Menu, Drawer } from 'antd';
import {
    DashboardOutlined,
    CalendarOutlined,
    UserOutlined,
    DollarOutlined,
    FileTextOutlined,
    SettingOutlined,
    ClockCircleOutlined,
    ScheduleOutlined,
    ScissorOutlined,
    ShopOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

interface SidebarProps {
    collapsed?: boolean;
    mobile?: boolean;
    open?: boolean;
    onClose?: () => void;
    className?: string; // Add className to props
}

const Sidebar: React.FC<SidebarProps> = ({
    collapsed = false,
    mobile = false,
    open = false,
    onClose,
    className
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Custom MAK Logo component
    const Logo = () => (
        <div className={`flex items-center justify-center py-6 ${collapsed ? 'px-2' : 'px-6'}`}>
            {collapsed ? (
                <div className="text-2xl font-bold font-serif italic" style={{ fontFamily: '"Permanent Marker", cursive' }}>M</div>
            ) : (
                <div className="w-full">
                    {/* Simplified text representation of the stylized MAK logo for now */}
                    <h1 className="text-4xl font-bold tracking-tighter text-text-primary" style={{ fontFamily: '"Permanent Marker", cursive', transform: 'rotate(-5deg)' }}>MAK</h1>
                </div>
            )}
        </div>
    );

    const menuItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/appointments',
            icon: <CalendarOutlined />,
            label: 'Appointments',
        },
        {
            key: '/queues', // Changed from orders based on image "Queues"
            icon: <UserOutlined />, // Queue icon
            label: 'Queues',
        },
        {
            key: '/clients',
            icon: <UserOutlined />,
            label: 'Clients',
        },
        {
            key: '/payments',
            icon: <DollarOutlined />,
            label: 'Payments',
        },
        {
            key: '/financial-summary',
            icon: <FileTextOutlined />,
            label: 'Financial Summary',
        },
        {
            key: '/timing',
            icon: <ClockCircleOutlined />,
            label: 'Timing',
        },
        {
            key: '/shifts',
            icon: <ScheduleOutlined />,
            label: 'Shifts',
        },
        {
            key: '/barbers',
            icon: <ScissorOutlined />,
            label: 'Barbers',
        },
        {
            key: '/salon',
            icon: <ShopOutlined />,
            label: 'Salons',
        },
        {
            key: '/services',
            icon: <ScissorOutlined />, // Reusing Scissor for now, or maybe SkinOutlined if available? Using Scissor as placeholder or find better one. Let's use SkinOutlined if I import it, or just Scissor. User used Scissor for Barber. Let's send ScissorOutlined for now or checking imports.
            label: 'Services',
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
    ];

    // Common menu content
    const menuContent = (
        <>
            <Logo />
            <div className="px-4">
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => {
                        navigate(key);
                        if (mobile && onClose) onClose();
                    }}
                    className="border-0"
                    style={{ borderRight: 0 }}
                    itemIcon={(props: any) =>
                        props.icon ? React.cloneElement(props.icon as React.ReactElement, {
                            style: { fontSize: '18px' }
                        }) : null
                    }
                />
            </div>
            <style>{`
                /* Custom overrides for Ant Menu to match the design */
                .ant-menu-item {
                    margin-bottom: 8px !important;
                    border-radius: 8px !important;
                    color: #8E8E8E !important;
                    font-weight: 500 !important;
                }
                .ant-menu-item-selected {
                    background-color: #FFF8E1 !important; /* Light yellow bg for active */
                    color: #F5BE49 !important; /* Yellow text for active */
                }
                .ant-menu-item-selected .anticon {
                    color: #F5BE49 !important;
                }
                 /* Hover state */
                .ant-menu-item:hover {
                    color: #F5BE49 !important;
                }
            `}</style>
        </>
    );

    if (mobile) {
        return (
            <Drawer
                placement="left"
                onClose={onClose}
                open={open}
                styles={{ body: { padding: 0 } }}
                width={260}
                className={className}
            >
                {menuContent}
            </Drawer>
        );
    }

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className={`min-h-screen border-r border-gray-100 ${className}`}
            width={260}
            theme="light"
            breakpoint="lg"
            style={{ backgroundColor: 'white' }}
        >
            {menuContent}
        </Sider>
    );
};

export default Sidebar;
