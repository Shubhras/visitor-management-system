import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginResponse, LoginPayload, User } from './authTypes';

const getStoredUser = (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
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
        loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
            const { data } = action.payload;
            state.loading = false;
            state.user = data.user;
            state.token = data.access;
            state.refreshToken = data.refresh;
            state.isAuthenticated = true;

            localStorage.setItem('token', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('user', JSON.stringify(data.user));
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
