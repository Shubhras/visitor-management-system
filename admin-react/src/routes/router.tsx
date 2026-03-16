import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import MainLayout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import ErrorPage from '../pages/error/ErrorPage';
import VisitorList from '../pages/visitors/VisitorList';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/reset-password',
        element: <ResetPassword />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/',
        element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path: 'visitors',
                element: <VisitorList />,
            },
        ],
    },
]);
