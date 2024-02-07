import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers';

const middleware = [thunk];

const preloadedState = {};
const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
    reducer: rootReducer(),
    preloadedState
});

export default store;
