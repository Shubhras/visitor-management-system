import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoaderProps {
    message?: string;
    fullPage?: boolean;
}

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
