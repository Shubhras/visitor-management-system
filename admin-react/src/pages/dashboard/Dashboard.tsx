import React from 'react';
import { Box, Typography } from '@mui/material';

const Dashboard: React.FC = () => {
    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 100px)', // Adjust based on header/footer height
            }}
        >
            <Typography variant="h2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                Dashboard
            </Typography>
        </Box>
    );
};

export default Dashboard;
