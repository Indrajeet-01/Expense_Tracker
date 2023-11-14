

import axios from 'axios';
import { ADD_EXPENSE, DISPLAY_EXPENSES,DELETE_EXPENSE} from '../constants/expense';

export const addExpense = (expenseData, token) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        'http://localhost:8800/expense/addExpense',
        expenseData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Dispatch the ADD_EXPENSE action with the response data
      dispatch({
        type: ADD_EXPENSE,
        payload: response.data,
      });

      console.log(response.data);
      alert('Expense added successfully');
      
    } catch (error) {
      
      console.error('Error:', error);
      alert('An error occurred while adding the expense');
    }
  };
};

export const displayExpenses = (token) => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:8800/expense/displayExpenses', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    dispatch({
      type: DISPLAY_EXPENSES,
      payload: response.data,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    
  }
};

export const deleteExpense = (expenseId, token) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:8800/expense/deleteExpense/${expenseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    dispatch({
      type: DELETE_EXPENSE,
      payload: expenseId,
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    
  }
};
