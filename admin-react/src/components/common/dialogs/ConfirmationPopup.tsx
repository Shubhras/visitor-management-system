import React from 'react';
import {
    Dialog,
    DialogContent,
    Typography,
    DialogActions,
    Button,
    Box,
} from '@mui/material';
import {
    CheckCircleOutline as SuccessIcon,
    ErrorOutline as ErrorIcon,
    InfoOutlined as InfoIcon,
    ReportProblemOutlined as WarningAmberIcon
} from '@mui/icons-material';

/**
 * Props for the ConfirmationPopup component.
 */
type ConfirmationPopupProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    subTitle?: string;
    onConfirm: () => void;
    confirmText?: string;
    confirmColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
};

/**
 * A highly reusable and customizable confirmation dialog.
 * Automatically adjusts icons and colors based on the 'confirmColor' prop.
 * Used for delete confirmations, status changes, and other critical actions.
 */
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

    /**
     * Internal helper to determine icon and color mapping based on confirmColor
     */
    const getIconConfig = () => {
        switch (confirmColor) {
            case 'success':
                return {
                    Icon: SuccessIcon,
                    bgColor: '#f0fdf4',
                    iconColor: '#22c55e',
                };
            case 'error':
                return {
                    Icon: ErrorIcon,
                    bgColor: '#fef2f2',
                    iconColor: '#ef4444',
                };
            case 'warning':
                return {
                    Icon: WarningAmberIcon,
                    bgColor: '#fff7ed',
                    iconColor: '#f59e0b',
                };
            case 'info':
            case 'primary':
                return {
                    Icon: InfoIcon,
                    bgColor: '#f0f9ff',
                    iconColor: '#3b82f6',
                };
            default:
                return {
                    Icon: InfoIcon,
                    bgColor: '#f8fafc',
                    iconColor: '#64748b',
                };
        }
    };

    const { Icon, bgColor, iconColor } = getIconConfig();

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    sx: { borderRadius: '16px', p: 1 }
                }
            }}
        >
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pt: 4, pb: 2 }}>
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3
                    }}
                >
                    <Icon sx={{ fontSize: 50, color: iconColor }} />
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
