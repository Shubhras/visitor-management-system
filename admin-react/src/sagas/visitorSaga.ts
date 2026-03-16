import { put, takeLatest, delay } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
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
import type { Visitor, VisitorQueryParams, AddVisitorPayload, UpdateVisitorPayload } from '../features/visitor/visitorTypes';

// Mocking initial data for demonstration
const mockVisitors: Visitor[] = [
    { id: '1', name: 'John Doe', phone: '1234567890', unit: '101', visitDate: '2023-10-25', status: 'Pending' },
    { id: '2', name: 'Jane Smith', phone: '0987654321', unit: '202', visitDate: '2023-10-26', status: 'Approved' },
    { id: '3', name: 'Alice Johnson', phone: '1122334455', unit: '303', visitDate: '2023-10-27', status: 'Rejected' },
    { id: '4', name: 'Bob Brown', phone: '5566778899', unit: '404', visitDate: '2023-10-28', status: 'Pending' },
];

function* fetchVisitorsSaga(action: PayloadAction<VisitorQueryParams>) {
    try {
        const params = action.payload;
        yield delay(500); // Simulate API delay

        // In real app:
        // const response = yield call(axiosInstance.get, '/visitors', { params });
        // yield put(fetchVisitorsSuccess(response.data));

        // Mock logic
        let filtered = [...mockVisitors];
        if (params.search) {
            filtered = filtered.filter(v =>
                v.name.toLowerCase().includes(params.search!.toLowerCase()) ||
                v.phone.includes(params.search!)
            );
        }
        if (params.status) {
            filtered = filtered.filter(v => v.status === params.status);
        }

        if (params.sortBy) {
            filtered.sort((a, b) => {
                const valA = a[params.sortBy as keyof Visitor];
                const valB = b[params.sortBy as keyof Visitor];
                if (params.sortOrder === 'asc') {
                    return valA > valB ? 1 : -1;
                } else {
                    return valA < valB ? 1 : -1;
                }
            });
        }

        const total = filtered.length;
        const start = params.page * params.limit;
        const paginated = filtered.slice(start, start + params.limit);

        yield put(fetchVisitorsSuccess({ list: paginated, total }));
    } catch (error) {
        yield put(fetchVisitorsFailure(error instanceof Error ? error.message : 'Failed to fetch visitors'));
    }
}

function* addVisitorSaga(action: PayloadAction<AddVisitorPayload>) {
    try {
        yield delay(500);
        const newVisitor: Visitor = {
            ...action.payload,
            id: Math.random().toString(36).substr(2, 9),
            status: 'Pending'
        };
        yield put(addVisitorSuccess(newVisitor));
    } catch (error) {
        yield put(addVisitorFailure(error instanceof Error ? error.message : 'Failed to add visitor'));
    }
}

function* updateVisitorStatusSaga(action: PayloadAction<{ id: string; status: Visitor['status'] }>) {
    try {
        yield delay(500);
        yield put(updateVisitorStatusSuccess(action.payload));
    } catch (error) {
        yield put(updateVisitorStatusFailure(error instanceof Error ? error.message : 'Failed to update status'));
    }
}

function* updateVisitorSaga(action: PayloadAction<UpdateVisitorPayload>) {
    try {
        yield delay(500);
        // In real app, you'd get the full updated object from the backend
        const updatedVisitor: Visitor = {
            ...action.payload,
            status: 'Pending' // Or keep existing status
        };
        yield put(updateVisitorSuccess(updatedVisitor));
    } catch (error) {
        yield put(updateVisitorFailure(error instanceof Error ? error.message : 'Failed to update visitor'));
    }
}

function* deleteVisitorSaga(action: PayloadAction<string>) {
    try {
        yield delay(500);
        yield put(deleteVisitorSuccess(action.payload));
    } catch (error) {
        yield put(deleteVisitorFailure(error instanceof Error ? error.message : 'Failed to delete visitor'));
    }
}

export default function* visitorSaga() {
    yield takeLatest(fetchVisitorsRequest.type, fetchVisitorsSaga);
    yield takeLatest(addVisitorRequest.type, addVisitorSaga);
    yield takeLatest(updateVisitorRequest.type, updateVisitorSaga);
    yield takeLatest(updateVisitorStatusRequest.type, updateVisitorStatusSaga);
    yield takeLatest(deleteVisitorRequest.type, deleteVisitorSaga);
}
