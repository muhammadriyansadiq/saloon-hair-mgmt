import React, { useState } from 'react';
import { Layout, Grid } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content } = Layout;

interface MainLayoutProps {
    pageTitle?: string;
}

const { useBreakpoint } = Grid;

const MainLayout: React.FC<MainLayoutProps> = ({ pageTitle = 'Dashboard' }) => {
    const screens = useBreakpoint();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleToggle = () => {
        if (!screens.lg) {
            setMobileOpen(!mobileOpen);
        } else {
            setCollapsed(!collapsed);
        }
    };

    return (
        <Layout className="min-h-screen">
            {/* Desktop Sidebar */}
            <Sidebar
                className="hidden lg:block"
                collapsed={collapsed}
            />

            {/* Mobile Sidebar (Drawer) */}
            <Sidebar
                mobile
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                className="lg:hidden"
            />

            <Layout>
                <Header
                    title={pageTitle}
                    collapsed={collapsed}
                    onToggle={handleToggle}
                />
                <Content className="bg-background p-6">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
