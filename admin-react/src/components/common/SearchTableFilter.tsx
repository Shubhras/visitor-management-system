import React from 'react';
import { TextField, InputAdornment, useTheme } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

/**
 * Props for the SearchTableFilter component.
 */
type SearchTableFilterProps = Omit<TextFieldProps, 'onChange'> & {
    /** Current search value */
    value: string;
    /** Callback when value changes */
    onChange: (value: string) => void;
};

/**
 * A reusable search input component designed for table filtering.
 * 
 */
const SearchTableFilter: React.FC<SearchTableFilterProps> = ({
    value,
    onChange,
    placeholder = "Search...",
    sx,
    ...props
}) => {
    const theme = useTheme();

    return (
        <TextField
            placeholder={placeholder}
            size="small"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{
                width: { xs: '100%', md: 240 },
                '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: theme.palette.background.paper,
                },
                ...sx
            }}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" fontSize="small" />
                        </InputAdornment>
                    ),
                }
            }}
            {...props}
        />
    );
};

export default SearchTableFilter;
