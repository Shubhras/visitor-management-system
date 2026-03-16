import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Typography,
    Chip,
    Tooltip,
    Stack,
    TextField,
    MenuItem,
    TablePagination,
    TableSortLabel,
    useTheme,
} from '@mui/material';

import {
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Edit as EditIcon,
    People as PeopleIcon,
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import toast from 'react-hot-toast';

import {
    fetchVisitorsRequest,
    updateVisitorStatusRequest,
    deleteVisitorRequest,
    setQueryParams,
} from '../../features/visitor/visitorSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import type { Visitor } from '../../features/visitor/visitorTypes';
import Loader from '../../components/common/Loader';
import ResetButtonTableFilter from '../../components/common/ResetButtonTableFilter';
import SearchTableFilter from '../../components/common/SearchTableFilter';
import { StyledTableContainer, StyledHeaderCell, StyledTableRow, ActionStack } from '../../components/common/TableStyles';
import AddEditVisitor from './AddEditVisitor';
import ConfirmationPopup from '../../components/common/dialogs/ConfirmationPopup';
interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    render?: (visitor: Visitor, index: number) => React.ReactNode;
}

const VisitorList: React.FC = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { list, total, loading, error, params } = useAppSelector((state) => state.visitor);

    // Popup state
    const [modalVisitorOpen, setModalVisitorOpen] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

    // Delete Confirmation state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [visitorToDelete, setVisitorToDelete] = useState<string | null>(null);

    // Action tracking logic
    const isDeleting = useRef(false);
    const isUpdatingStatus = useRef(false);

    // Notifications for List Actions
    useEffect(() => {
        if (!loading && !error) {
            if (isDeleting.current) {
                toast.success('Visitor deleted successfully!');
                isDeleting.current = false;
            }
            if (isUpdatingStatus.current) {
                toast.success('Status updated successfully!');
                isUpdatingStatus.current = false;
            }
        }
        if (!loading && error) {
            isDeleting.current = false;
            isUpdatingStatus.current = false;
        }
    }, [loading, error]);

    const loadVisitors = useCallback(() => {
        dispatch(fetchVisitorsRequest(params));
    }, [dispatch, params]);

    useEffect(() => {
        loadVisitors();
    }, [loadVisitors]);

    const handleParamChange = (newParams: Partial<typeof params>) => {
        dispatch(setQueryParams({ ...newParams, page: newParams.page !== undefined ? newParams.page : 0 }));
    };

    const handleSearchChange = (value: string) => {
        handleParamChange({ search: value });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleParamChange({ status: e.target.value });
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        dispatch(setQueryParams({ page: newPage }));
    };

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setQueryParams({ limit: parseInt(e.target.value, 10), page: 0 }));
    };

    const handleReset = () => {
        dispatch(setQueryParams({
            page: 0,
            search: '',
            status: '',
            sortBy: 'visitDate',
            sortOrder: 'desc',
        }));
    };

    const handleSort = (property: string) => {
        const isAsc = params.sortBy === property && params.sortOrder === 'asc';
        dispatch(setQueryParams({
            sortBy: property,
            sortOrder: isAsc ? 'desc' : 'asc'
        }));
    };

    const handleStatusUpdate = (id: string, status: Visitor['status']) => {
        isUpdatingStatus.current = true;
        dispatch(updateVisitorStatusRequest({ id, status }));
    };

    const handleDelete = (id: string) => {
        setVisitorToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (visitorToDelete) {
            isDeleting.current = true;
            dispatch(deleteVisitorRequest(visitorToDelete));
            setVisitorToDelete(null);
        }
    };

    const getStatusColor = (status: Visitor['status']) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Rejected': return 'error';
            default: return 'warning';
        }
    };

    const handleAddClick = () => {
        setSelectedVisitor(null);
        setModalVisitorOpen(true);
    };

    const handleEditClick = (visitor: Visitor) => {
        setSelectedVisitor(visitor);
        setModalVisitorOpen(true);
    };

    const handleCloseVisitorModal = () => {
        setModalVisitorOpen(false);
        setSelectedVisitor(null);
    };

    // Columns Configuration
    const columns: Column[] = [
        {
            id: 'srNo',
            label: 'Sr.No.',
            minWidth: 70,
            render: (_, index) => params.page * params.limit + index + 1
        },
        {
            id: 'name',
            label: 'Visitor Name',
            minWidth: 150,
            sortable: true,
            render: (visitor) => (
                <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    {visitor.name}
                </Typography>
            )
        },
        { id: 'phone', label: 'Phone', minWidth: 120 },
        { id: 'unit', label: 'Unit', minWidth: 100 },
        {
            id: 'visitDate',
            label: 'Visit Date',
            minWidth: 130,
            sortable: true,
            render: (visitor) => DateTime.fromISO(visitor.visitDate).toLocaleString(DateTime.DATE_MED)
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 110,
            render: (visitor) => (
                <Chip
                    label={visitor.status}
                    color={getStatusColor(visitor.status)}
                    variant="outlined"
                    size="small"
                    sx={{
                        fontWeight: 600,
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        height: '24px',
                        borderWidth: '1.5px'
                    }}
                />
            )
        },
        {
            id: 'actions',
            label: 'Action',
            minWidth: 150,
            align: 'center',
            render: (visitor) => (
                <ActionStack>
                    <Tooltip title="Approve">
                        <span>
                            <IconButton
                                color="success"
                                size="small"
                                onClick={() => handleStatusUpdate(visitor.id, 'Approved')}
                                disabled={visitor.status === 'Approved'}
                                sx={{
                                    bgcolor: visitor.status === 'Approved' ? 'transparent' : 'rgba(74, 222, 128, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(74, 222, 128, 0.2)' }
                                }}
                            >
                                <ApproveIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Reject">
                        <span>
                            <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleStatusUpdate(visitor.id, 'Rejected')}
                                disabled={visitor.status === 'Rejected'}
                                sx={{
                                    bgcolor: visitor.status === 'Rejected' ? 'transparent' : 'rgba(248, 113, 113, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.2)' }
                                }}
                            >
                                <RejectIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEditClick(visitor)}
                            sx={{ bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            size="small"
                            onClick={() => handleDelete(visitor.id)}
                            sx={{ color: '#94a3b8', bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0', color: '#ef4444' } }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </ActionStack>
            )
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Visitor Management
            </Typography>

            {/* Filter and Action Section */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems="center"
                sx={{ mb: 3 }}
            >
                <SearchTableFilter
                    placeholder="Search Visitors..."
                    value={params.search || ''}
                    onChange={handleSearchChange}
                />
                <TextField
                    select
                    size="small"
                    value={params.status}
                    onChange={handleStatusChange}
                    sx={{
                        width: { xs: '100%', md: 160 },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: theme.palette.background.paper
                        }
                    }}
                    slotProps={{ select: { displayEmpty: true } }}
                >
                    <MenuItem value="">Status</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                </TextField>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} />
                <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' }, justifyContent: 'flex-end' }}>
                    <ResetButtonTableFilter onReset={handleReset} />

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddClick}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '12px',
                            px: 4,
                            height: 44,
                            fontWeight: 700,
                            flexGrow: { xs: 1, md: 0 },
                        }}
                    >
                        Add Visitor
                    </Button>
                </Stack>
            </Stack>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {/* Config-driven Table Section */}
            <StyledTableContainer component={Paper}>
                {loading && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        bgcolor: 'rgba(255,255,255,0.7)',
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Loader />
                    </Box>
                )}
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <StyledHeaderCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.sortable ? (
                                        <TableSortLabel
                                            active={params.sortBy === column.id}
                                            direction={params.sortBy === column.id ? params.sortOrder : 'asc'}
                                            onClick={() => handleSort(column.id)}
                                        >
                                            {column.label}
                                        </TableSortLabel>
                                    ) : (
                                        column.label
                                    )}
                                </StyledHeaderCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((visitor, index) => (
                            <StyledTableRow key={visitor.id} hover>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align}>
                                        {column.render
                                            ? column.render(visitor, index)
                                            : visitor[column.id as keyof Visitor]
                                        }
                                    </TableCell>
                                ))}
                            </StyledTableRow>
                        ))}
                        {list.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 10 }}>
                                    <Box sx={{ opacity: 0.5, textAlign: 'center' }}>
                                        <PeopleIcon sx={{ fontSize: 60, mb: 1, color: 'text.secondary' }} />
                                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                                            No visitors found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Try adjusting your search or filters
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={total}
                    rowsPerPage={params.limit}
                    page={params.page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
                />
            </StyledTableContainer>
            {/* Add/Edit Popup */}
            <AddEditVisitor
                open={modalVisitorOpen}
                onClose={handleCloseVisitorModal}
                visitor={selectedVisitor}
            />

            {/* Confirmation Popup */}
            <ConfirmationPopup
                open={deleteDialogOpen}
                setOpen={setDeleteDialogOpen}
                title="Delete Visitor"
                subTitle="Are you sure you want to delete this visitor? This action cannot be undone."
                onConfirm={confirmDelete}
            />
        </Box>
    );
};

export default VisitorList;
