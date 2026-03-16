import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginSuccessResponse, LoginPayload, User } from './authTypes';

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

const initialState: AuthState = {
    user: getStoredUser(),
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
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

            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
});

export const { loginRequest, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
