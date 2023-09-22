import { db } from "../db.js";


// add new expense 
export const addExpense = (req, res) => {
    const userId = req.user.id;
    const { amountSpent, expenseDescription, expenseCategory } = req.body;
    
    const expense = {
        user_id: userId, // Associate the expense with the logged-in user
        amount_spent: amountSpent,
        expense_description: expenseDescription,
        expense_category: expenseCategory,
    };

    // Insert the expense into the 'addexpense' table
    const insertQuery = 'INSERT INTO addexpense (user_id, amount_spent, expense_description, expense_category) VALUES (?, ?, ?, ?)';
    const updateQuery = 'UPDATE users SET total_expense = total_expense + ? WHERE id = ?';

    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add expense.' });
        }
        db.query(insertQuery, [expense.user_id, expense.amount_spent, expense.expense_description, expense.expense_category], (err, result) => {
            if (err) {
                db.rollback(() => {
                    res.status(500).json({ error: 'Failed to add expense.' });
                });
            } else {
                const newExpense = { id: result.insertId, ...expense };

                db.query(updateQuery, [expense.amount_spent, expense.user_id], (err) => {
                    if (err) {
                        db.rollback(() => {
                            res.status(500).json({ error: 'Failed to update total expense.' });
                        });
                    } else {
                        db.commit((err) => {
                            if (err) {
                                db.rollback(() => {
                                    res.status(500).json({ error: 'Failed to commit transaction.' });
                                });
                            } else {
                                res.status(201).json(newExpense);
                            }
                        });
                    }
                });
            }
        });
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

// delete expense
export const deleteExpense = (req, res) => {
    const userId = req.user.id;
    const expenseId = req.params.expenseId; 

    const query = 'DELETE FROM addexpense WHERE id = ? AND user_id = ?';

    db.query(query, [expenseId, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete expense.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Expense not found or you do not have permission to delete it.' });
        }

        res.status(200).json({ message: 'Expense deleted successfully.' });
    });
};

