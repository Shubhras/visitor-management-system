import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Visitor, VisitorsState, AddVisitorPayload, UpdateVisitorPayload, VisitorQueryParams } from './visitorTypes';

const initialState: VisitorsState = {
    list: [],
    total: 0,
    loading: false,
    success: false,
    error: null,
    params: {
        page: 0,
        limit: 10,
        search: '',
        status: '',
        sortBy: 'visitDate',
        sortOrder: 'desc',
    },
};

const visitorsSlice = createSlice({
    name: 'visitors',
    initialState,
    reducers: {
        fetchVisitorsRequest: (state, _action: PayloadAction<VisitorQueryParams>) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        fetchVisitorsSuccess: (state, action: PayloadAction<{ list: Visitor[]; total: number }>) => {
            state.loading = false;
            state.list = action.payload.list;
            state.total = action.payload.total;
        },
        fetchVisitorsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        addVisitorRequest: (state, _action: PayloadAction<AddVisitorPayload>) => {
            state.loading = true;
        },
        addVisitorSuccess: (state, action: PayloadAction<Visitor>) => {
            state.loading = false;
            state.success = true;
            state.list.unshift(action.payload);
            state.total += 1;
        },
        addVisitorFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateVisitorRequest: (state, _action: PayloadAction<UpdateVisitorPayload>) => {
            state.loading = true;
        },
        updateVisitorSuccess: (state, action: PayloadAction<Visitor>) => {
            state.loading = false;
            state.success = true;
            const index = state.list.findIndex((v) => v.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        updateVisitorFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateVisitorStatusRequest: (state, _action: PayloadAction<{ id: string; status: Visitor['status'] }>) => {
            state.loading = true;
        },
        updateVisitorStatusSuccess: (state, action: PayloadAction<{ id: string; status: Visitor['status'] }>) => {
            state.loading = false;
            const index = state.list.findIndex((v) => v.id === action.payload.id);
            if (index !== -1) {
                state.list[index].status = action.payload.status;
            }
        },
        updateVisitorStatusFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteVisitorRequest: (state, _action: PayloadAction<string>) => {
            state.loading = true;
        },
        deleteVisitorSuccess: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.list = state.list.filter((v) => v.id !== action.payload);
            state.total -= 1;
        },
        deleteVisitorFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        setQueryParams: (state, action: PayloadAction<Partial<VisitorQueryParams>>) => {
            state.params = { ...state.params, ...action.payload };
        },
        clearVisitorSuccess: (state) => {
            state.success = false;
        },
    },
});

export const {
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
    setQueryParams,
    clearVisitorSuccess,
} = visitorsSlice.actions;

export default visitorsSlice.reducer;
