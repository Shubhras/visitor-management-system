import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Alert,
    CircularProgress,
    Link,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../../features/auth/authSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import loginBg from '../../assets/login-bg.png';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormValues) => {
        dispatch(loginRequest(data));
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                backgroundImage: `radial-gradient(#e5e7eb 1px, transparent 1px), radial-gradient(#e5e7eb 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 20px 20px',
                p: { xs: 2, md: 4 },
            }}
        >
            <Paper
                elevation={24}
                sx={{
                    width: '100%',
                    maxWidth: '1000px',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
                            backgroundColor: 'rgba(0,0,0,0.1)',
                        }
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 900,
                                color: '#1a1a1a',
                                letterSpacing: '-1px',
                                display: 'flex',
                                alignItems: 'baseline',
                            }}
                        >
                            iPlus
                            <Box component="span" sx={{ color: '#2ecc71', ml: 1, fontSize: '0.8em' }}>
                                living
                            </Box>
                        </Typography>
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
                        backgroundColor: '#ffffff',
                    }}
                >
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                color: '#1a1a1a',
                                mb: 1
                            }}
                        >
                            Welcome Back!!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                            To keep connected with us please login with your personal info
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#4b5563' }}>
                                Username <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                            </Typography>
                            <TextField
                                {...register('email')}
                                placeholder="Username"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        backgroundColor: '#fff',
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#4b5563' }}>
                                Password <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                            </Typography>
                            <TextField
                                {...register('password')}
                                type="password"
                                placeholder="Password"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        backgroundColor: '#fff',
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
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 700,
                                background: '#2ecc71 !important', // Using !important to override theme gradient
                                '&:hover': {
                                    background: '#27ae60 !important',
                                },
                                borderRadius: '8px',
                                textTransform: 'none',
                                boxShadow: '0 4px 14px 0 rgba(46, 204, 113, 0.39)',
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                        </Button>
                    </form>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;

