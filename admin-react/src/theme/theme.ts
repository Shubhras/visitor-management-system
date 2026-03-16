import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2962ff',
            light: '#dbeafe',
            dark: '#1e40af',
            contrastText: '#fff',
        },
        secondary: {
            main: '#7c4dff',
            light: '#e1bee7', // From image
            dark: '#6200ea',
            contrastText: '#fff',
        },
        background: {
            default: '#f4f7fe',
            paper: '#ffffff',
        },
        text: {
            primary: '#1b2559',
            secondary: '#a3aed0',
        },
        divider: '#e0e5f2',
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
