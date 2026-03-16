import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AxiosResponse } from 'axios';
import axiosInstance from '../services/axiosInstance';
import {
    fetchVisitorsRequest,
    fetchVisitorsSuccess,
    fetchVisitorsFailure,
    addVisitorRequest,
    addVisitorSuccess,
    addVisitorFailure,
    updateVisitorStatusRequest,
    updateVisitorStatusSuccess,
    updateVisitorStatusFailure,
    updateVisitorRequest,
    updateVisitorSuccess,
    updateVisitorFailure,
    deleteVisitorRequest,
    deleteVisitorSuccess,
    deleteVisitorFailure,
} from '../features/visitor/visitorSlice';
import type {
    Visitor,
    VisitorQueryParams,
    AddVisitorPayload,
    UpdateVisitorPayload,
    FetchVisitorsResponse,
    VisitorApiResponse,
} from '../features/visitor/visitorTypes';

interface AxiosErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosErrorResponse;
        if (axiosError.response?.data?.message) {
            return axiosError.response.data.message;
        }
    }
    return error instanceof Error ? error.message : fallback;
}

function* fetchVisitorsSaga(action: PayloadAction<VisitorQueryParams>) {
    try {
        const params = action.payload;

        // Build query params for API
        const queryParams: Record<string, string | number> = {
            page: params.page + 1,
            limit: params.limit,
        };

        if (params.search) {
            queryParams.search = params.search;
        }
        if (params.status) {
            queryParams.status = params.status;
        }
        if (params.sortBy) {
            queryParams.sortBy = params.sortBy;
        }
        if (params.sortOrder) {
            queryParams.sortOrder = params.sortOrder;
        }

        const response: AxiosResponse<FetchVisitorsResponse> = yield call(
            axiosInstance.get,
            '/visitors',
            { params: queryParams }
        );

        yield put(fetchVisitorsSuccess(response.data));
    } catch (error: unknown) {
        yield put(fetchVisitorsFailure(getErrorMessage(error, 'Failed to fetch visitors')));
    }
}

function* addVisitorSaga(action: PayloadAction<AddVisitorPayload>) {
    try {
        const response: AxiosResponse<VisitorApiResponse> = yield call(
            axiosInstance.post,
            '/visitors',
            action.payload
        );

        if (response.data.success) {
            yield put(addVisitorSuccess(response.data.data));
        } else {
            yield put(addVisitorFailure(response.data.message || 'Failed to add visitor'));
        }
    } catch (error: unknown) {
        yield put(addVisitorFailure(getErrorMessage(error, 'Failed to add visitor')));
    }
}

function* updateVisitorStatusSaga(action: PayloadAction<{ id: number; status: Visitor['status'] }>) {
    try {
        const { id, status } = action.payload;
        const endpoint = status === 'APPROVED' ? `/visitors/${id}/approve` : `/visitors/${id}/reject`;

        const response: AxiosResponse<VisitorApiResponse> = yield call(
            axiosInstance.patch,
            endpoint
        );

        if (response.data.success) {
            yield put(updateVisitorStatusSuccess({ id, status }));
        } else {
            yield put(updateVisitorStatusFailure(response.data.message || 'Failed to update status'));
        }
    } catch (error: unknown) {
        yield put(updateVisitorStatusFailure(getErrorMessage(error, 'Failed to update status')));
    }
}

function* updateVisitorSaga(action: PayloadAction<UpdateVisitorPayload>) {
    try {
        const { id, ...data } = action.payload;
        const response: AxiosResponse<VisitorApiResponse> = yield call(
            axiosInstance.put,
            `/visitors/${id}`,
            data
        );

        if (response.data.success) {
            yield put(updateVisitorSuccess(response.data.data));
        } else {
            yield put(updateVisitorFailure(response.data.message || 'Failed to update visitor'));
        }
    } catch (error: unknown) {
        yield put(updateVisitorFailure(getErrorMessage(error, 'Failed to update visitor')));
    }
}

function* deleteVisitorSaga(action: PayloadAction<number>) {
    try {
        const response: AxiosResponse<{ success: boolean; message?: string }> = yield call(
            axiosInstance.delete,
            `/visitors/${action.payload}`
        );

        if (response.data.success) {
            yield put(deleteVisitorSuccess(action.payload));
        } else {
            yield put(deleteVisitorFailure(response.data.message || 'Failed to delete visitor'));
        }
    } catch (error: unknown) {
        yield put(deleteVisitorFailure(getErrorMessage(error, 'Failed to delete visitor')));
    }
}

export default function* visitorSaga() {
    yield takeLatest(fetchVisitorsRequest.type, fetchVisitorsSaga);
    yield takeLatest(addVisitorRequest.type, addVisitorSaga);
    yield takeLatest(updateVisitorRequest.type, updateVisitorSaga);
    yield takeLatest(updateVisitorStatusRequest.type, updateVisitorStatusSaga);
    yield takeLatest(deleteVisitorRequest.type, deleteVisitorSaga);
}
