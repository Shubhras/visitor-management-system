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
    forgotPasswordRequest,
    forgotPasswordSuccess,
    forgotPasswordFailure,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFailure,
} from '../features/auth/authSlice';
import type { LoginResponse, LoginPayload, ForgotPasswordPayload, ResetPasswordPayload, AuthApiResponse } from '../features/auth/authTypes';

interface AxiosErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

function* loginSaga(action: PayloadAction<LoginPayload>) {
    try {
        const response: AxiosResponse<LoginResponse> = yield call(axiosInstance.post, '/auth/login', action.payload);
        const data = response.data;

        if (data.success) {
            yield put(loginSuccess(data));
        } else {
            yield put(loginFailure(data.message));
        }
    } catch (error: unknown) {
        let errorMessage = 'Login failed. Please check your credentials.';
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as AxiosErrorResponse;
            if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            }
        }
        yield put(loginFailure(errorMessage));
    }
}

function* logoutSaga() {
    try {
        yield call(axiosInstance.post, '/auth/logout');
    } catch {
        // Even if API call fails, still logout locally
    }
    yield put(logoutSuccess());
}

function* forgotPasswordSaga(action: PayloadAction<ForgotPasswordPayload>) {
    try {
        const response: AxiosResponse<AuthApiResponse> = yield call(axiosInstance.post, '/auth/forgot-password', action.payload);
        if (response.data.success) {
            yield put(forgotPasswordSuccess(response.data));
        } else {
            yield put(forgotPasswordFailure(response.data.message || 'Failed to send reset link.'));
        }
    } catch (error: unknown) {
        let errorMessage = 'Failed to send reset link.';
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as AxiosErrorResponse;
            if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            }
        }
        yield put(forgotPasswordFailure(errorMessage));
    }
}

function* resetPasswordSaga(action: PayloadAction<ResetPasswordPayload>) {
    try {
        const response: AxiosResponse<AuthApiResponse> = yield call(axiosInstance.post, '/auth/reset-password', action.payload);
        if (response.data.success) {
            yield put(resetPasswordSuccess(response.data));
        } else {
            yield put(resetPasswordFailure(response.data.message || 'Failed to reset password.'));
        }
    } catch (error: unknown) {
        let errorMessage = 'Failed to reset password.';
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as AxiosErrorResponse;
            if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            }
        }
        yield put(resetPasswordFailure(errorMessage));
    }
}

export default function* authSaga() {
    yield takeLatest(loginRequest.type, loginSaga);
    yield takeLatest(logoutRequest.type, logoutSaga);
    yield takeLatest(forgotPasswordRequest.type, forgotPasswordSaga);
    yield takeLatest(resetPasswordRequest.type, resetPasswordSaga);
}
