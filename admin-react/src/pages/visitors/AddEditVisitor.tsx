import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    useTheme,
    InputAdornment
} from '@mui/material';
import { Close as CloseIcon, Person, Phone, Home, Event } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTime } from 'luxon';
import toast from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addVisitorRequest, updateVisitorRequest, clearVisitorSuccess } from '../../features/visitor/visitorSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import type { Visitor } from '../../features/visitor/visitorTypes';

const visitorSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name cannot exceed 50 characters'),
    phone: z.string()
        .min(10, 'Phone must be at least 10 digits')
        .max(10, 'Phone must be exactly 10 digits')
        .regex(/^\d+$/, 'Phone must contain only numbers'),
    unitNumber: z.string().min(3, 'Unit number must be at least 3 characters').max(50, 'Unit number cannot exceed 50 characters'),
    visitDate: z.string().min(1, 'Visit date is required'),
});

type VisitorFormValues = z.infer<typeof visitorSchema>;

interface AddEditVisitorProps {
    open: boolean;
    onClose: () => void;
    visitor?: Visitor | null;
}

const AddEditVisitor: React.FC<AddEditVisitorProps> = ({ open, onClose, visitor }) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { loading, error, success } = useAppSelector((state) => state.visitor);

    const isEditMode = !!visitor;

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<VisitorFormValues>({
        resolver: zodResolver(visitorSchema),
        defaultValues: {
            name: '',
            phone: '',
            unitNumber: '',
            visitDate: '',
        },
    });

    // Populate form on edit mode
    useEffect(() => {
        if (open) {
            dispatch(clearVisitorSuccess());
            if (visitor) {
                reset({
                    name: visitor.name,
                    phone: visitor.phone,
                    unitNumber: visitor.unitNumber,
                    visitDate: visitor.visitDate,
                });
            } else {
                reset({
                    name: '',
                    phone: '',
                    unitNumber: '',
                    visitDate: '',
                });
            }
        }
    }, [open, visitor, reset, dispatch]);

    // Close dialog on success
    useEffect(() => {
        if (success) {
            toast.success(isEditMode ? 'Visitor updated successfully!' : 'Visitor added successfully!');
            dispatch(clearVisitorSuccess());
            onClose();
        }
    }, [success, onClose, isEditMode, dispatch]);

    // Show error toast
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const onSubmit = (data: VisitorFormValues) => {
        if (isEditMode && visitor) {
            dispatch(updateVisitorRequest({ id: visitor.id, ...data }));
        } else {
            dispatch(addVisitorRequest(data));
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: { borderRadius: '24px', p: 1 }
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, pt: 3, px: 3 }}>
                <Typography variant="h5" component="span" sx={{ color: theme.palette.text.primary }}>
                    {isEditMode ? 'Edit Visitor' : 'Add New Visitor'}
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ color: theme.palette.text.secondary }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 1 }}>


                    <form id="visitor-form" onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
                            <Box>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: theme.palette.text.primary }}>
                                    Visitor Name <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                                </Typography>
                                <TextField
                                    {...register('name')}
                                    placeholder="Enter visitor name"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person sx={{ color: theme.palette.text.secondary, fontSize: '1.2rem' }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: theme.palette.background.paper,
                                        }
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: theme.palette.text.primary }}>
                                    Phone Number <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                                </Typography>
                                <TextField
                                    {...register('phone')}
                                    placeholder="10-digit number"
                                    fullWidth
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                    onChange={(e) => {
                                        const value = e.target.value.replaceAll(/\D/g, '');
                                        e.target.value = value.slice(0, 10);
                                        register('phone').onChange(e);
                                    }}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Phone sx={{ color: theme.palette.text.secondary, fontSize: '1.2rem' }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: theme.palette.background.paper,
                                        }
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <Box>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: theme.palette.text.primary }}>
                                        Unit Number <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                                    </Typography>
                                    <TextField
                                        {...register('unitNumber')}
                                        placeholder="e.g. 101"
                                        fullWidth
                                        error={!!errors.unitNumber}
                                        helperText={errors.unitNumber?.message}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Home sx={{ color: theme.palette.text.secondary, fontSize: '1.2rem' }} />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                backgroundColor: theme.palette.background.paper,
                                            }
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: theme.palette.text.primary }}>
                                        Visit Date <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                                    </Typography>
                                    <Controller
                                        name="visitDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                minDate={DateTime.now()}
                                                value={field.value ? DateTime.fromISO(field.value) : null}
                                                onChange={(newValue: DateTime | null) => {
                                                    field.onChange(newValue ? newValue.toISODate() : '');
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: !!errors.visitDate,
                                                        helperText: errors.visitDate?.message,
                                                        placeholder: "Select Date",
                                                        slotProps: {
                                                            input: {
                                                                startAdornment: (
                                                                    <InputAdornment position="start" sx={{ mr: 1 }}>
                                                                        <Event sx={{ color: theme.palette.text.secondary, fontSize: '1.2rem' }} />
                                                                    </InputAdornment>
                                                                ),
                                                            },
                                                        },
                                                        sx: {
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '12px',
                                                                backgroundColor: theme.palette.background.paper,
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 4, pt: 2, justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                    disabled={loading}
                    sx={{
                        textTransform: 'none',
                        borderRadius: '8px',
                        borderColor: '#cbd5e1',
                        color: '#64748b',
                        fontWeight: 600,
                    }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    form="visitor-form"
                    variant="contained"
                    disabled={loading}
                    sx={{
                        px: 6,
                        borderRadius: '16px',
                        fontWeight: 700,
                        minWidth: 120,
                        height: 48,
                        textTransform: 'none',
                        boxShadow: '0px 10px 20px rgba(41, 98, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: '0px 15px 30px rgba(41, 98, 255, 0.3)',
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? 'Update' : 'Submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEditVisitor;
