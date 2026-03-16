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
    People as VisitorsIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
    isMobile: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Visitors', icon: <VisitorsIcon />, path: '/visitors' },
    ];

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                borderRight: '1px solid',
                borderColor: 'divider',
                pt: 10
            }}
        >
            <List sx={{ px: 2, py: 0 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) onClose();
                                }}
                                selected={isActive}
                                sx={{
                                    borderRadius: '12px',
                                    py: 1.2,
                                    px: 2,
                                    '&.Mui-selected': {
                                        bgcolor: 'secondary.light',
                                        color: 'secondary.main',
                                        '&:hover': {
                                            bgcolor: 'secondary.light',
                                        },
                                        '& .MuiListItemIcon-root': { color: 'secondary.main' },
                                    },
                                    '&:hover': {
                                        bgcolor: 'rgba(99, 102, 241, 0.04)',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{
                                    minWidth: 35,
                                    color: isActive ? 'secondary.main' : 'text.secondary',
                                    transition: 'color 0.2s',
                                    '& .MuiSvgIcon-root': { fontSize: '1.4rem' }
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    slotProps={{
                                        primary: {
                                            sx: {
                                                fontSize: '0.9rem',
                                                fontWeight: isActive ? 700 : 500,
                                                color: isActive ? 'secondary.main' : 'text.secondary',
                                                transition: 'all 0.2s'
                                            }
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};

export default Sidebar;
