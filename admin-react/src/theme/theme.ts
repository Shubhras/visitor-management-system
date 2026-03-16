import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#6366f1', // Indigo Purple (Modern & Professional)
            light: '#f8fafc', // Very light slate for backgrounds
            dark: '#4f46e5',
            contrastText: '#fff',
        },
        secondary: {
            main: '#7c4dff', // Logo Purple
            light: '#f5f3ff', // Very light purple for active states
            dark: '#6200ea',
            contrastText: '#fff',
        },
        background: {
            default: '#f8fafc', // Light slate background
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a', // Slate 900
            secondary: '#64748b', // Slate 500
        },
        divider: '#f1f5f9',
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', // More modern font
        h1: { fontSize: '2.5rem', fontWeight: 800, color: '#2b3674' },
        h2: { fontSize: '2rem', fontWeight: 800, color: '#2b3674' },
        h3: { fontSize: '1.75rem', fontWeight: 700, color: '#2b3674' },
        h4: { fontSize: '1.5rem', fontWeight: 700, color: '#2b3674' },
        h5: { fontSize: '1.25rem', fontWeight: 700, color: '#2b3674' },
        h6: { fontSize: '1.1rem', fontWeight: 700, color: '#2b3674' },
        button: { textTransform: 'none', fontWeight: 700 },
        body1: { fontSize: '1rem', color: '#2b3674' },
        body2: { fontSize: '0.875rem', color: '#a3aed0' },
    },
    shape: {
        borderRadius: 16, // Slightly more rounded for modern feel
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '10px 24px',
                    boxShadow: 'none',
                    borderRadius: '12px',
                    '&:hover': {
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                    },
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#1a50e5',
                        boxShadow: '0px 10px 20px rgba(41, 98, 255, 0.2)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.02), 0px 10px 10px -5px rgba(0, 0, 0, 0.01)',
                    border: '1px solid #e0e5f2',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    padding: '20px',
                    boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.02)',
                    border: '1px solid #e0e5f2',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                fullWidth: true,
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                        '& fieldset': {
                            borderColor: '#e0e5f2',
                        },
                        '&:hover fieldset': {
                            borderColor: '#2962ff',
                        },
                    },
                },
            },
        },
    },
});

export default theme;
