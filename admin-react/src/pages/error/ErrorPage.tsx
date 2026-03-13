import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ReplayIcon from '@mui/icons-material/Replay';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    let errorMessage: string;
    let errorStatus: number | string = 'Error';
    let errorTitle: string = 'Oops! Something went wrong';

    if (isRouteErrorResponse(error)) {
        // error is Amazon S3 Error response
        errorStatus = error.status;
        errorMessage = error.data?.message || error.statusText;

        if (error.status === 404) {
            errorTitle = 'Page Not Found';
            errorMessage = "The page you're looking for doesn't exist or has been moved.";
        } else if (error.status === 401) {
            errorTitle = 'Unauthorized';
            errorMessage = "You don't have permission to view this page.";
        } else if (error.status === 503) {
            errorTitle = 'Service Unavailable';
            errorMessage = "Looks like our API is down. Please try again later.";
        } else if (error.status === 418) {
            errorTitle = "I'm a teapot";
            errorMessage = "";
        }
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        console.error(error);
        errorMessage = 'Unknown error occurred';
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                padding: 3
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 4, md: 8 },
                        textAlign: 'center',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
                    }}
                >
                    <Box
                        sx={{
                            mb: 4,
                            display: 'inline-flex',
                            p: 2,
                            borderRadius: '50%',
                            bgcolor: 'error.light',
                            color: 'error.main',
                            animation: 'pulse 2s infinite ease-in-out',
                            '@keyframes pulse': {
                                '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.4)' },
                                '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(211, 47, 47, 0)' },
                                '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(211, 47, 47, 0)' }
                            }
                        }}
                    >
                        <ErrorOutlineIcon sx={{ fontSize: 80 }} />
                    </Box>

                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '4rem', md: '6rem' },
                            fontWeight: 800,
                            color: 'text.secondary',
                            opacity: 0.2,
                            mb: -2
                        }}
                    >
                        {errorStatus}
                    </Typography>

                    <Typography
                        variant="h3"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            color: 'primary.main',
                            mb: 2
                        }}
                    >
                        {errorTitle}
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 6, fontSize: '1.2rem', maxWidth: '600px', mx: 'auto' }}
                    >
                        {errorMessage}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<HomeIcon />}
                            onClick={() => navigate('/')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                            }}
                        >
                            Back to Home
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<ReplayIcon />}
                            onClick={() => window.location.reload()}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                fontWeight: 600
                            }}
                        >
                            Try Again
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default ErrorPage;
