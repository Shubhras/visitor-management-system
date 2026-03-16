import React from 'react';
import {
    Dialog,
    DialogContent,
    Typography,
    DialogActions,
    Button,
    Box,
} from '@mui/material';
import { WarningAmber as WarningIcon } from '@mui/icons-material';

type ConfirmationPopupProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    subTitle?: string;
    onConfirm: () => void;
    confirmText?: string;
    confirmColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
};

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
    open,
    setOpen,
    title,
    subTitle,
    onConfirm,
    confirmText = 'Yes, Delete',
    confirmColor = 'error'
}) => {
    const handleClose = () => setOpen(false);

    const handleConfirm = () => {
        setOpen(false);
        if (onConfirm) {
            onConfirm();
        }
    };

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: { borderRadius: '16px', p: 1 }
            }}
        >
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pt: 4, pb: 2 }}>
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: confirmColor === 'error' ? '#fff7ed' : (confirmColor === 'success' ? '#f0fdf4' : '#f0f9ff'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3
                    }}
                >
                    <WarningIcon sx={{ fontSize: 50, color: confirmColor === 'error' ? '#f59e0b' : (confirmColor === 'success' ? '#22c55e' : '#3b82f6') }} />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                        {title}
                    </Typography>
                    {subTitle && (
                        <Typography variant="body1" sx={{ color: '#64748b' }}>
                            {subTitle}
                        </Typography>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 4, px: 4 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleClose}
                    sx={{
                        textTransform: 'none',
                        borderRadius: '8px',
                        borderColor: '#cbd5e1',
                        color: '#64748b',
                        fontWeight: 600,
                        flex: 1
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color={confirmColor}
                    onClick={handleConfirm}
                    sx={{
                        textTransform: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        flex: 1
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationPopup;
