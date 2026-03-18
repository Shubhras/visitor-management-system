/**
 * File: visitorSlice.ts
 * Purpose: Redux Toolkit slice for managing visitor-related state and actions.
 * Handles fetching, adding, updating, and deleting visitors.
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Visitor, VisitorsState, AddVisitorPayload, UpdateVisitorPayload, VisitorQueryParams, FetchVisitorsResponse } from './visitorTypes';

// Initial state for the visitors module
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

// Slice definition containing all reducers and actions
const visitorsSlice = createSlice({
    name: 'visitors',
    initialState,
    reducers: {
        // Reducers for fetching visitors list
        fetchVisitorsRequest: (state, action: PayloadAction<VisitorQueryParams>) => {
            state.params = action.payload;
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        fetchVisitorsSuccess: (state, action: PayloadAction<FetchVisitorsResponse>) => {
            state.loading = false;
            state.list = action.payload.data;
            state.total = action.payload.pagination.total;
        },
        fetchVisitorsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Reducers for adding a new visitor
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

        // Reducers for updating an existing visitor record
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

        // Reducers for updating visitor status (Pending/Approved/Rejected)
        updateVisitorStatusRequest: (state, _action: PayloadAction<{ id: number; status: Visitor['status'] }>) => {
            state.loading = true;
        },
        updateVisitorStatusSuccess: (state, action: PayloadAction<{ id: number; status: Visitor['status'] }>) => {
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

        // Reducers for deleting a visitor record
        deleteVisitorRequest: (state, _action: PayloadAction<number>) => {
            state.loading = true;
        },
        deleteVisitorSuccess: (state, action: PayloadAction<number>) => {
            state.loading = false;
            state.list = state.list.filter((v) => v.id !== action.payload);
            state.total -= 1;
        },
        deleteVisitorFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Action to update query parameters (search, pagination, etc.)
        setQueryParams: (state, action: PayloadAction<Partial<VisitorQueryParams>>) => {
            state.params = { ...state.params, ...action.payload };
            // Reset to page 0 when filters change (unless page itself is being set)
            if (action.payload.search !== undefined || action.payload.status !== undefined) {
                state.params.page = 0;
            }
        },

        // Action to reset the success flag
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
