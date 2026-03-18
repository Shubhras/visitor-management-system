/**
 * File: store.ts
 * Description: Configures the Redux store with reducers and saga middleware.
 */

import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from '../features/auth/authSlice';
import visitorReducer from '../features/visitor/visitorSlice';
import rootSaga from '../sagas/rootSaga';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure Redux store
export const store = configureStore({
    reducer: {
        auth: authReducer,       // Auth state
        visitor: visitorReducer, // Visitor state
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: true }).concat(sagaMiddleware),
});

// Run root saga
sagaMiddleware.run(rootSaga);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;