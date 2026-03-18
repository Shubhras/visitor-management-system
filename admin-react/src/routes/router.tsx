import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';

import MainLayout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import ErrorPage from '../pages/error/ErrorPage';
import VisitorList from '../pages/visitors/VisitorList';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/',
        element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Navigate to="/visitors" replace />,
            },

            {
                path: 'visitors',
                element: <VisitorList />,
            },
        ],
    },
]);
