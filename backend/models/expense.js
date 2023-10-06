import mongoose from "mongoose";

const addExpenseSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // This references the User model
    },
    amount_spent: {
      type: Number,
      required: true,
    },
    expense_description: String,
    expense_category: String,
  });
  
  const AddExpense = mongoose.model('AddExpense', addExpenseSchema);

export default AddExpense