// redux/actions.js

import axios from 'axios';
import { ADD_EXPENSE } from '../constants/expense';

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

      // Optionally, you can handle the success message and redirection in the component
      console.log(response.data);
      alert('Expense added successfully');
      // You can redirect the user to another page if needed
      
    } catch (error) {
      // Handle errors and dispatch any error-related actions if needed
      console.error('Error:', error);
      alert('An error occurred while adding the expense');
    }
  };
};
