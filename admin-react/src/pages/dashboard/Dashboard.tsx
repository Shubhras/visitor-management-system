import React from 'react';
import { Box, Typography } from '@mui/material';

const Dashboard: React.FC = () => {
    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                    <Typography variant="h4">Dashboard </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    mt: 4,
                    p: 6,
                    border: '1px dashed #ddd',
                    borderRadius: 1,
                    textAlign: 'center',
                    bgcolor: '#fafafa'
                }}
            >
                <Typography color="text.secondary">
                    Dashboard content will appear here.
                </Typography>
            </Box>
        </Box>
    );
};

export default Dashboard;
