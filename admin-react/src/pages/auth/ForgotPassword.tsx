import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress,
    useTheme,
    Link,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import { forgotPasswordRequest, clearAuthStatus } from '../../features/auth/authSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import loginBg from '../../assets/login-bg.png';

const forgotPasswordSchema = z.object({
    email: z.email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { loading, error, forgotPasswordSuccess } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(clearAuthStatus());
    }, [dispatch]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: ForgotPasswordFormValues) => {
        dispatch(forgotPasswordRequest(data));
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.background.default,
                backgroundImage: `radial-gradient(${theme.palette.divider} 1px, transparent 1px), radial-gradient(${theme.palette.divider} 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 20px 20px',
                p: { xs: 2, md: 4 },
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: '1000px',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    overflow: 'hidden',
                    borderRadius: '24px',
                    boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.05)',
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                {/* Left Side - Image and Logo */}
                <Box
                    sx={{
                        flex: 1.2,
                        position: 'relative',
                        minHeight: { xs: '200px', md: '600px' },
                        backgroundImage: `url(${loginBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 4,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.02)',
                        }
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    color: '#ffffff',
                                    letterSpacing: '-1.5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    lineHeight: 1,
                                    textShadow: '0px 2px 10px rgba(0,0,0,0.2)'
                                }}
                            >
                                Genio
                                <Box
                                    component="span"
                                    sx={{
                                        position: 'relative',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        ml: 1.5,
                                        width: { xs: '70px', md: '95px' },
                                        height: { xs: '70px', md: '95px' },
                                        borderRadius: '50%',
                                        filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.15))',
                                        '&::before, &::after': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: 0,
                                            borderRadius: '50%',
                                            border: '6px solid transparent',
                                            background: 'linear-gradient(180deg, #e9d5ff 0%, #9333ea 100%) border-box',
                                            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                                            WebkitMaskComposite: 'destination-out',
                                            maskComposite: 'exclude',
                                        },
                                        '&::before': {
                                            clipPath: 'polygon(0 0, 100% 0, 100% 42%, 0 42%)',
                                        },
                                        '&::after': {
                                            clipPath: 'polygon(0 58%, 100% 58%, 100% 100%, 0 100%)',
                                        }
                                    }}
                                >
                                    <Box
                                        component="span"
                                        sx={{
                                            color: '#ffffff',
                                            fontSize: '0.85em',
                                            fontWeight: 900,
                                            letterSpacing: '-1px'
                                        }}
                                    >
                                        360
                                    </Box>
                                </Box>
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Right Side - Form */}
                <Box
                    sx={{
                        flex: 1,
                        p: { xs: 4, md: 6 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.background.paper,
                    }}
                >
                    <Box sx={{ mb: 5, textAlign: 'center' }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                color: theme.palette.text.primary,
                                mb: 1.5,
                                fontSize: { xs: '2rem', md: '2.5rem' }
                            }}
                        >
                            Forgot Password?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                            Enter your email and we'll send you a link to reset your password.
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {forgotPasswordSuccess && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Password reset link has been sent to your email.
                        </Alert>
                    )}

                    {!forgotPasswordSuccess && (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: theme.palette.text.primary }}>
                                    Email Address <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                                </Typography>
                                <TextField
                                    {...register('email')}
                                    placeholder="Enter your registered email"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: theme.palette.background.paper,
                                        }
                                    }}
                                />
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    py: 2,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    borderRadius: '16px',
                                    textTransform: 'none',
                                    boxShadow: '0px 10px 20px rgba(41, 98, 255, 0.2)',
                                    transition: 'all 0.3s ease',
                                    mb: 3,
                                    '&:hover': {
                                        boxShadow: '0px 15px 30px rgba(41, 98, 255, 0.3)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
                            </Button>
                        </form>
                    )}

                    <Box sx={{ textAlign: 'center' }}>
                        <Link
                            component={RouterLink}
                            to="/login"
                            sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            Back to Login
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default ForgotPassword;
