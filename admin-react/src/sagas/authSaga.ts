import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../services/axiosInstance';
import type { AxiosResponse } from 'axios';
import {
    loginRequest,
    loginSuccess,
    loginFailure,
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
        const response: AxiosResponse<LoginResponse> = yield call(axiosInstance.post, '/api/v1/master/login/', action.payload);
        yield put(loginSuccess(response.data));
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

export default function* authSaga() {
    yield takeLatest(loginRequest.type, loginSaga);
}
