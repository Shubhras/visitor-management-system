/**
 * File: authSlice.ts
 * Purpose: Redux Toolkit slice for managing authentication-related state and actions.
 * Handles login, logout, token management, and user data persistence.
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginSuccessResponse, LoginPayload, RefreshTokenResponse, User } from './authTypes';

/**
 * Utility function to retrieve the stored user from localStorage.
 * Safely parses the JSON or removes the corrupted key if necessary.
 */
const getStoredUser = (): User | null => {
    try {
        const user = localStorage.getItem('user');
        if (user && user !== 'undefined') {
            return JSON.parse(user) as User;
        }
    } catch {
        localStorage.removeItem('user');
    }
    return null;
};

// Initial state for the authentication module
const initialState: AuthState = {
    user: getStoredUser(),
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

// Slice definition containing all reducers and actions for Auth
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Reducers for login operations
        loginRequest: (state, _: PayloadAction<LoginPayload>) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<LoginSuccessResponse>) => {
            const { accessToken, refreshToken, user } = action.payload;
            state.loading = false;
            state.user = user;
            state.token = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;

            // Persistence
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Reducers for logout operations
        logoutRequest: (state) => {
            state.loading = true;
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        },

        // Action to handle token refresh logic
        tokenRefreshed: (state, action: PayloadAction<RefreshTokenResponse>) => {
            const { accessToken, refreshToken } = action.payload;
            state.token = accessToken;
            state.refreshToken = refreshToken;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        },

        // Action to clear any authentication-related error messages
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    logoutRequest,
    logoutSuccess,
    tokenRefreshed,
    clearError,
} = authSlice.actions;

export default authSlice.reducer;
