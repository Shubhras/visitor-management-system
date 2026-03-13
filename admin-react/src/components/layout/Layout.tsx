import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 280;

const Layout: React.FC = () => {
    const [open, setOpen] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Dashboard';
        return 'Dashboard';
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header
                open={open}
                drawerWidth={drawerWidth}
                handleDrawerToggle={handleDrawerToggle}
                handleLogout={handleLogout}
                title={getPageTitle()}
            />
            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                open={open}
                onClose={handleDrawerToggle}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                    },
                }}
            >
                <Sidebar
                    isMobile={isMobile}
                    onClose={handleDrawerToggle}
                    handleLogout={handleLogout}
                />
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    mt: 8,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
