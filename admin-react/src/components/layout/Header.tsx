import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Avatar,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { ListItemIcon, ListItemText } from '@mui/material';

interface HeaderProps {
    handleDrawerToggle: () => void;
    handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleDrawerToggle, handleLogout }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                width: '100%',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.02)',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        sx={{ mr: 2, color: '#333' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 900,
                                color: 'primary.main',
                                letterSpacing: '-0.5px',
                                display: 'flex',
                                alignItems: 'baseline',
                            }}
                        >
                            Genio
                            <Box component="span" sx={{ color: 'secondary.main', fontSize: '1.1em' }}>
                                360
                            </Box>
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleMenu}>
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#f5f5f5',
                            color: '#333',
                            border: '1px solid #ddd'
                        }}
                    >
                        <PersonIcon />
                    </Avatar>
                    <Typography
                        variant="body2"
                        sx={{
                            ml: 1.5,
                            fontWeight: 600,
                            color: 'text.primary',
                            display: { xs: 'none', sm: 'block' }
                        }}
                    >
                        admin
                    </Typography>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Profile</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" color="error" />
                            </ListItemIcon>
                            <ListItemText sx={{ color: 'error.main' }}>Logout</ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
