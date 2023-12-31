
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from '../contexts/actions/expense';
import '../styles/addExpense.css'; 

const AddExpense = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.user.token);

  const [amountSpent, setAmountSpent] = useState(0);
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('food'); 

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const expenseData = {
      amountSpent,
      expenseDescription,
      expenseCategory,
    };

    dispatch(addExpense(expenseData, token));

    setAmountSpent(0);
    setExpenseDescription('');
    setExpenseCategory('food'); 
  };

  return (
    <form onSubmit={handleFormSubmit} className="expense-form">
      <label htmlFor="amountSpent">Amount Spent:</label>
      <input
        type="number"
        id="amountSpent"
        name="amountSpent"
        value={amountSpent}
        onChange={(e) => setAmountSpent(e.target.value)}
        required
      />

      <label htmlFor="expenseDescription">Expense Description:</label>
      <input
        type="text"
        id="expenseDescription"
        name="expenseDescription"
        value={expenseDescription}
        onChange={(e) => setExpenseDescription(e.target.value)}
        required
      />

      <label htmlFor="expenseCategory">Expense Category:</label>
      <select
        id="expenseCategory"
        name="expenseCategory"
        value={expenseCategory}
        onChange={(e) => setExpenseCategory(e.target.value)}
        required
      >
        <option value="food">Food</option>
        <option value="maintenance">Maintenance</option>
        <option value="clothes">Clothes</option>
        <option value="school-fees">School Fees</option>
        <option value="others">Others</option>
      </select>

      <button type="submit">Add Expense</button>
    </form>
  );
};

export default AddExpense;

