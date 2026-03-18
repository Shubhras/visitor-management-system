/**
 * File: rootSaga.ts
 * Description: Root saga that aggregates and runs all feature-specific sagas.
 * Acts as the single entry point for Redux-Saga middleware within the application.
 */

import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import visitorSaga from './visitorSaga';

/**
 * Root saga responsible for initializing and running all watcher sagas in parallel.
 * The 'all' effect allows multiple sagas to execute concurrently without blocking.
 */
export default function* rootSaga() {
    yield all([
        authSaga(),     // Manages authentication-related side effects
        visitorSaga(),  // Manages visitor-related side effects (list, add, update, etc.)
    ]);
}