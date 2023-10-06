

import User from '../models/user.js'
import AddExpense from "../models/expense.js";


// add new expense 
export const addExpense = async (req, res) => {
    const userId = req.user.id;
    const { amountSpent, expenseDescription, expenseCategory } = req.body;

    try {
        const newExpense = new AddExpense({
            user: userId, 
            amount_spent: amountSpent,
            expense_description: expenseDescription,
            expense_category: expenseCategory,
        });

      // Save the new expense document
        await newExpense.save();

      // Update the user's total_expense field
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json("User not found");
        }

        user.total_expense += amountSpent;
        await user.save();

        res.status(201).json(newExpense);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Failed to add expense.' });
    }
};

// get all expenses
export const getExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expenses = await AddExpense.find({ user: userId });

        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// delete expense
export const deleteExpense = async (req, res) => {
    const userId = req.user.id;
    const expenseId = req.params.expenseId;

    try {
      // Find and delete the expense by its _id and associated user
        const deletedExpense = await AddExpense.findOneAndDelete({ _id: expenseId, user: userId });

        if (!deletedExpense) {
            return res.status(404).json({ error: 'Expense not found or you do not have permission to delete it.' });
        }

        res.status(200).json({ message: 'Expense deleted successfully.' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Failed to delete expense.' });
    }
};

