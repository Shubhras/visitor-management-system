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
            // Role based access control - only allow admin role
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


export default function* authSaga() {
    yield takeLatest(loginRequest.type, loginSaga);
    yield takeLatest(logoutRequest.type, logoutSaga);
}
