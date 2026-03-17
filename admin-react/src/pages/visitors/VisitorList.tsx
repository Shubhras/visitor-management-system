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
    const [visitorToDelete, setVisitorToDelete] = useState<number | null>(null);

    // Status Confirmation state
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusPayload, setStatusPayload] = useState<{ id: number; status: Visitor['status'] } | null>(null);

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
        dispatch(setQueryParams({ ...newParams, page: newParams.page ?? 0 }));
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
        dispatch(setQueryParams({ limit: Number.parseInt(e.target.value, 10), page: 0 }));
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

    const handleStatusUpdate = (id: number, status: Visitor['status']) => {
        setStatusPayload({ id, status });
        setStatusDialogOpen(true);
    };

    const confirmStatusUpdate = () => {
        if (statusPayload) {
            isUpdatingStatus.current = true;
            dispatch(updateVisitorStatusRequest(statusPayload));
            setStatusPayload(null);
        }
    };

    const handleDelete = (id: number) => {
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
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'error';
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
        { id: 'unitNumber', label: 'Unit', minWidth: 100 },
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
            render: (visitor: Visitor) => {
                const isPending = visitor.status === 'PENDING';
                return (
                    <ActionStack>
                        <Tooltip title="Approve">
                            <span>
                                <IconButton
                                    size="small"
                                    onClick={() => handleStatusUpdate(visitor.id, 'APPROVED')}
                                    disabled={!isPending}
                                    className="btn-action btn-approve"
                                    sx={{ color: "#15803d" }}
                                >
                                    <ApproveIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Reject">
                            <span>
                                <IconButton
                                    size="small"
                                    onClick={() => handleStatusUpdate(visitor.id, 'REJECTED')}
                                    disabled={!isPending}
                                    className="btn-action btn-reject"
                                    sx={{ color: "#b91c1c" }}
                                >
                                    <RejectIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <IconButton
                                size="small"
                                onClick={() => handleEditClick(visitor)}
                                className="btn-action btn-edit"
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                                size="small"
                                onClick={() => handleDelete(visitor.id)}
                                className="btn-action btn-delete"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </ActionStack>
                );
            }
        }
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
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
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="APPROVED">Approved</MenuItem>
                    <MenuItem value="REJECTED">Rejected</MenuItem>
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

            {/* Config-driven Table Section */}
            <Box className="table-responsive-container">
                <StyledTableContainer component={Paper} sx={{ display: 'flex', flexDirection: 'column' }}>
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
            </Box>
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

            {/* Status Confirmation Popup */}
            <ConfirmationPopup
                open={statusDialogOpen}
                setOpen={setStatusDialogOpen}
                title={`${statusPayload?.status === 'APPROVED' ? 'Approve' : 'Reject'} Visitor`}
                subTitle={`Are you sure you want to ${statusPayload?.status?.toLowerCase()} this visitor?`}
                onConfirm={confirmStatusUpdate}
                confirmText={`Yes, ${statusPayload?.status === 'APPROVED' ? 'Approve' : 'Reject'}`}
                confirmColor={statusPayload?.status === 'APPROVED' ? 'success' : 'error'}
            />
        </Box>
    );
};

export default VisitorList;
