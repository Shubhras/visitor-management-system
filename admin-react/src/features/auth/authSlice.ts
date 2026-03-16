import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginSuccessResponse, LoginPayload, RefreshTokenResponse, User, ForgotPasswordPayload, ResetPasswordPayload, AuthApiResponse } from './authTypes';

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
    forgotPasswordSuccess: false,
    resetPasswordSuccess: false,
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
        tokenRefreshed: (state, action: PayloadAction<RefreshTokenResponse>) => {
            const { accessToken, refreshToken } = action.payload;
            state.token = accessToken;
            state.refreshToken = refreshToken;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        },
        clearError: (state) => {
            state.error = null;
        },
        forgotPasswordRequest: (state, _: PayloadAction<ForgotPasswordPayload>) => {
            state.loading = true;
            state.error = null;
            state.forgotPasswordSuccess = false;
        },
        forgotPasswordSuccess: (state, _: PayloadAction<AuthApiResponse>) => {
            state.loading = false;
            state.forgotPasswordSuccess = true;
        },
        forgotPasswordFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.forgotPasswordSuccess = false;
        },
        resetPasswordRequest: (state, _: PayloadAction<ResetPasswordPayload>) => {
            state.loading = true;
            state.error = null;
            state.resetPasswordSuccess = false;
        },
        resetPasswordSuccess: (state, _: PayloadAction<AuthApiResponse>) => {
            state.loading = false;
            state.resetPasswordSuccess = true;
        },
        resetPasswordFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.resetPasswordSuccess = false;
        },
        clearAuthStatus: (state) => {
            state.forgotPasswordSuccess = false;
            state.resetPasswordSuccess = false;
            state.error = null;
        }
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
    forgotPasswordRequest,
    forgotPasswordSuccess,
    forgotPasswordFailure,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFailure,
    clearAuthStatus
} = authSlice.actions;
export default authSlice.reducer;
