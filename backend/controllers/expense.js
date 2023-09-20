import { db } from "../db.js";


// Add Expense controller
export const addExpense = (req, res) => {
    
    const userId = req.user.id

    
    const { amountSpent, expenseDescription, expenseCategory } = req.body
    
    const expense = {
        user_id: userId, // Associate the expense with the logged-in user
        amount_spent: amountSpent,
        expense_description: expenseDescription,
        expense_category: expenseCategory,
    };

    // Insert the expense into the 'addexpense' table
    const query = 'INSERT INTO addexpense (user_id, amount_spent, expense_description, expense_category) VALUES (?, ?, ?, ?)';

    db.query(query, [expense.user_id, expense.amount_spent, expense.expense_description, expense.expense_category], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add expense.' });
        }

        const newExpense = { id: result.insertId, ...expense };

        res.status(201).json(newExpense);
    });
};

// get all expenses
export const getExpense = (req, res) => {
    const userId = req.user.id; // Assuming you've set user information in the request object

    
    const q = "SELECT * FROM addexpense WHERE user_id = ?";

    db.query(q, [userId], (err, expenses) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json(expenses);
    });
};