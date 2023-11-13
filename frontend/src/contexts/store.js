// redux/store.js

import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from "redux-devtools-extension"
import userReducer from './reducers/user';
import expensesReducer from './reducers/expense';

const rootReducer = combineReducers({
  user: userReducer,
  expenses: expensesReducer,
  // Add other reducers if needed
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
