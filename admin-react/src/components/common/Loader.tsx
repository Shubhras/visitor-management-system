import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Props for the Loader component.
 */
interface LoaderProps {
    /** Loading message to display below the spinner */
    message?: string;
    /** Whether to take up the full viewport height (100vh) */
    fullPage?: boolean;
}

/**
 * A generic loading spinner component with an optional message.
 */
const Loader: React.FC<LoaderProps> = ({ message = 'Loading...', fullPage = false }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: fullPage ? '100vh' : '100%',
                minHeight: '200px',
                width: '100%',
            }}
        >
            <CircularProgress size={40} thickness={4} />
            {message && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2, fontWeight: 500 }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default Loader;
