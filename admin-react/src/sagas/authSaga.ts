/**
 * File: authSaga.ts
 * Purpose: Redux-Saga for handling side effects related to authentication.
 * Manages asynchronous API calls for login and logout operations.
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../services/axiosInstance';
import type { AxiosResponse } from 'axios';
import {
    loginRequest,
    loginSuccess,
    loginFailure,
    logoutRequest,
    logoutSuccess,
} from '../features/auth/authSlice';
import type { LoginResponse, LoginPayload } from '../features/auth/authTypes';

// Local interface for extracting error messages from API response
interface AxiosErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

/**
 * Worker saga that handles the login process.
 * Calls the login API, verifies roles, and updates Redux state.
 */
function* loginSaga(action: PayloadAction<LoginPayload>) {
    try {
        const response: AxiosResponse<LoginResponse> = yield call(axiosInstance.post, '/auth/login', action.payload);
        const data = response.data;

        if (data.success) {
            /** 
             * Role based access control (RBAC)
             * Only allow users with the 'admin' role to log in to this panel.
             */
            if (data.user.role === 'admin') {
                yield put(loginSuccess(data));
            } else {
                yield put(loginFailure('Access denied. Only administrators can login to this panel.'));
            }
        } else {
            yield put(loginFailure(data.message));
        }
    } catch (error: unknown) {
        let errorMessage = 'Login failed. Please check your credentials.';

        // Extracting specific error message from the response if available
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as AxiosErrorResponse;
            if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            }
        }
        yield put(loginFailure(errorMessage));
    }
}

/**
 * Worker saga that handles the logout process.
 * Attempts to notify the server and then clears local authentication data.
 */
function* logoutSaga() {
    try {
        yield call(axiosInstance.post, '/auth/logout');
    } catch {
        // Even if API call fails, we proceed to logout locally to ensure user state is cleared
    }
    yield put(logoutSuccess());
}

/**
 * Root watcher saga for authentication.
 * Listens for login and logout request actions.
 */
export default function* authSaga() {
    yield takeLatest(loginRequest.type, loginSaga);
    yield takeLatest(logoutRequest.type, logoutSaga);
}
