import React from 'react';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { RestartAlt as ResetIcon } from '@mui/icons-material';

/**
 * Props for the ResetButtonTableFilter component.
 */
interface ResetButtonTableFilterProps extends ButtonProps {
    /** Callback when reset button is clicked */
    onReset: () => void;
}

/**
 * A reusable reset button component used for clearing table filters.
 *
 */
const ResetButtonTableFilter: React.FC<ResetButtonTableFilterProps> = ({ onReset, sx, ...props }) => {
    return (
        <Button
            variant="outlined"
            startIcon={<ResetIcon />}
            onClick={onReset}
            sx={{
                textTransform: 'none',
                borderRadius: '8px',
                borderColor: '#cbd5e1',
                color: '#64748b',
                px: 3,
                height: 40,
                flexGrow: { xs: 1, md: 0 },
                '&:hover': {
                    borderColor: '#94a3b8',
                    backgroundColor: '#f8fafc',
                },
                ...sx,
            }}
            {...props}
        >
            Reset
        </Button>
    );
};

export default ResetButtonTableFilter;
