import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
    isMobile: boolean;
    onClose: () => void;
    handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, onClose, handleLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    ];

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'primary.light',
                pt: 8
            }}
        >
            <List sx={{ px: 0, py: 0 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => {
                                navigate(item.path);
                                if (isMobile) onClose();
                            }}
                            selected={location.pathname === item.path}
                            sx={{
                                py: 1.5,
                                px: 3,
                                '&.Mui-selected': {
                                    bgcolor: 'secondary.light',
                                    color: 'text.primary',
                                    '&:hover': {
                                        bgcolor: 'secondary.light',
                                        opacity: 0.9
                                    },
                                    '& .MuiListItemIcon-root': { color: 'text.primary' },
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(124, 77, 255, 0.08)',
                                }
                            }}
                        >
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: location.pathname === item.path ? 600 : 500,
                                    color: location.pathname === item.path ? '#000' : '#555'
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ mt: 'auto', p: 2 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 2,
                        color: 'error.main',
                        '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.04)' }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </Box>
        </Box>
    );
};

export default Sidebar;
