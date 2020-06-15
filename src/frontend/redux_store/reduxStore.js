import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';

import rootReducer from '../redux_reducers';

const initialState = {};

export const middleware = [thunk];

export const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middleware),
);

export const persistor = persistStore(store);

