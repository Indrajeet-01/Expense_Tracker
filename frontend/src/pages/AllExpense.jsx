// AllExpenses.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { displayExpenses, deleteExpense } from '../contexts/actions/expense';

const AllExpenses = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const expenses = useSelector((state) => state.expenses.expenses);

  useEffect(() => {
    if (token) {
      dispatch(displayExpenses(token));
    }
  }, [dispatch, token]);

  const deleteExpenseHandler = (expenseId) => {
    dispatch(deleteExpense(expenseId, token));
  };

  return (
    <div>
      <h1>Expense List</h1>
      <table>
        <thead>
          <tr>
            <th>Amount Spent</th>
            <th>Expense Description</th>
            <th>Expense Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.amount_spent}</td>
              <td>{expense.expense_description}</td>
              <td>{expense.expense_category}</td>
              <td>
                <button onClick={() => deleteExpenseHandler(expense.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllExpenses;
