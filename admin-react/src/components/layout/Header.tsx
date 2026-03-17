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
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Menu as MenuIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../hooks/useAppSelector';

interface HeaderProps {
    handleDrawerToggle: () => void;
    handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleDrawerToggle, handleLogout }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user } = useAppSelector((state) => state.auth);

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
                                fontWeight: 800,
                                color: '#2d1b69',
                                letterSpacing: '-0.5px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            Genio
                            <Box
                                component="span"
                                sx={{
                                    position: 'relative',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    ml: 0.8,
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    '&::before, &::after': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: 0,
                                        borderRadius: '50%',
                                        border: '3px solid transparent',
                                        background: 'linear-gradient(180deg, #e9d5ff 0%, #9333ea 100%) border-box',
                                        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                                        WebkitMaskComposite: 'destination-out',
                                        maskComposite: 'exclude',
                                    },
                                    '&::before': {
                                        clipPath: 'polygon(0 0, 100% 0, 100% 42%, 0 42%)',
                                    },
                                    '&::after': {
                                        clipPath: 'polygon(0 58%, 100% 58%, 100% 100%, 0 100%)',
                                    }
                                }}
                            >
                                <Box component="span" sx={{ fontSize: '0.75em', color: '#7c4dff', fontWeight: 900, letterSpacing: '-0.5px' }}>
                                    360
                                </Box>
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
                        {user?.email || 'Admin'}
                    </Typography>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    slotProps={{
                        paper: {
                            sx: {
                                mt: 1.5,
                                minWidth: 180,
                                boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
                                borderRadius: 1
                            }
                        }
                    }}
                >
                    <MenuItem onClick={() => { handleClose(); handleLogout(); }}>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText sx={{ color: 'error.main' }}>Logout</ListItemText>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
