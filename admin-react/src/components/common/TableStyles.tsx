import { styled, TableCell, TableRow, tableCellClasses } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import type { TableContainerProps } from '@mui/material/TableContainer';

/**
 * Premium Table Container with refined borders and shadows
 */
export const StyledTableContainer = styled(TableContainer)<TableContainerProps>(({ theme }) => ({
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.02), 0px 10px 10px -5px rgba(0, 0, 0, 0.01)',
    overflowX: 'auto',
    '& .MuiTable-root': {
        minWidth: 650,
    },
}));

/**
 * Modern Header Cell with distinctive background and typography
 */
export const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#f4f7fe', // Matching theme background default or a light variant
        color: theme.palette.text.secondary,
        fontWeight: 700,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        padding: '16px',
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '0.875rem',
        color: theme.palette.text.primary,
    },
}));

/**
 * Refined Table Row with smooth hover transitions
 */
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    transition: 'all 0.2s ease',
    '& td': {
        padding: '12px 16px',
        borderColor: theme.palette.divider,
    },
    '&:hover': {
        backgroundColor: 'rgba(244, 247, 254, 0.5) !important',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

/**
 * Common Action Stack for consistent spacing in Action column
 */
export const ActionStack = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    justifyContent: 'center',
    alignItems: 'center',
});
