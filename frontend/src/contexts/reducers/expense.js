// redux/reducers/expenses.js

import { ADD_EXPENSE } from '../constants/expense';

const initialState = {
  expenses: [],
};

const expensesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EXPENSE:
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    // Add other cases if needed
    default:
      return state;
  }
};

export default expensesReducer;
