import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import visitorSaga from './visitorSaga';

export default function* rootSaga() {
    yield all([
        authSaga(),
        visitorSaga(),
    ]);
}
