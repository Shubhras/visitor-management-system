import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
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
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be a valid 10-digit number'),
    unit: z.string().min(1, 'Unit number is required'),
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
            unit: '',
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
                    unit: visitor.unit,
                    visitDate: visitor.visitDate,
                });
            } else {
                reset({
                    name: '',
                    phone: '',
                    unit: '',
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
            PaperProps={{
                sx: { borderRadius: '12px', p: 1 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, pt: 3, px: 3 }}>
                <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                    {isEditMode ? 'Edit Visitor' : 'Add New Visitor'}
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ color: theme.palette.text.secondary }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 1 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                            {error}
                        </Alert>
                    )}

                    <form id="visitor-form" onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2.5 }}>
                            <TextField
                                {...register('name')}
                                label="Visitor Name"
                                placeholder="Enter full name"
                                fullWidth

                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                            <TextField
                                {...register('phone')}
                                label="Phone Number"
                                placeholder="10-digit number"
                                fullWidth

                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField
                                    {...register('unit')}
                                    label="Unit Number"
                                    placeholder="e.g. 101"
                                    fullWidth

                                    error={!!errors.unit}
                                    helperText={errors.unit?.message}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                                <Controller
                                    name="visitDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Visit Date"
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
                                                    sx: { '& .MuiOutlinedInput-root': { borderRadius: '12px' } }
                                                }
                                            }}
                                        />
                                    )}
                                />
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
                        textTransform: 'none',
                        borderRadius: '12px',
                        fontWeight: 700,
                        minWidth: 120,
                        height: 44,
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? 'Update' : 'Submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEditVisitor;
