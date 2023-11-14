// redux/reducers/expenses.js

import { ADD_EXPENSE,DELETE_EXPENSE, DISPLAY_EXPENSES } from '../constants/expense';

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

      
      case DISPLAY_EXPENSES:
        return {
          ...state,
          expenses: action.payload,
        };
      case DELETE_EXPENSE:
        return {
          ...state,
          expenses: state.expenses.filter((expense) => expense._id !== action.payload),
        };
    // Add other cases if needed
    default:
      return state;
  }
};

export default expensesReducer;
