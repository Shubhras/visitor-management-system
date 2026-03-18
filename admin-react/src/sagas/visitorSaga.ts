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

/**
 * Utility function to extract clear error messages from Axios or generic errors.
 * @param error - The error object caught in try-catch.
 * @param fallback - Default message if extraction fails.
 * @returns {string} - The most relevant error message found.
 */
function getErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosErrorResponse;
        if (axiosError.response?.data?.message) {
            return axiosError.response.data.message;
        }
    }
    return error instanceof Error ? error.message : fallback;
}

/**
 * Saga for fetching all visitors with dynamic filters, search, and pagination.
 * Dispatches success or failure actions based on API response.
 * @param action - Contains the QueryParams payload.
 */
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

/**
 * Saga for adding a new visitor entry via the API.
 * Validates the response status before updating the Redux state.
 * @param action - Contains the AddVisitorPayload.
 */
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

/**
 * Saga for updating a visitor's status (APPROVE/REJECT).
 * Maps the status to the corresponding API endpoint.
 * @param action - Contains visitor ID and new status.
 */
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

/**
 * Saga for updating general visitor details.
 * Dispatches updateVisitorSuccess with the updated record.
 * @param action - Contains the UpdateVisitorPayload.
 */
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

/**
 * Saga for deleting a visitor record by ID.
 * Refreshes or removes the visitor from the state upon success.
 * @param action - Contains the visitor ID as numeric payload.
 */
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

/**
 * Root Visitor Saga: Watches for all visitor-related action requests.
 * Uses takeLatest to ensure only the most recent request is processed.
 */
export default function* visitorSaga() {
    yield takeLatest(fetchVisitorsRequest.type, fetchVisitorsSaga);
    yield takeLatest(addVisitorRequest.type, addVisitorSaga);
    yield takeLatest(updateVisitorRequest.type, updateVisitorSaga);
    yield takeLatest(updateVisitorStatusRequest.type, updateVisitorStatusSaga);
    yield takeLatest(deleteVisitorRequest.type, deleteVisitorSaga);
}
