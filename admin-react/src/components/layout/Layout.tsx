import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
    Box,
    Drawer,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { logoutRequest } from '../../features/auth/authSlice';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 240;

const Layout: React.FC = () => {
    const [open, setOpen] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useDispatch();

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleLogout = () => {
        dispatch(logoutRequest());
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#ffffff' }}>
            <Header
                handleDrawerToggle={handleDrawerToggle}
                handleLogout={handleLogout}
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
                />
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 0,
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
