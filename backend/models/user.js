import mongoose from "mongoose";


// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email addresses are unique
  },
  password: {
    type: String,
    required: true,
  },
  is_premium: {
    type: Boolean,
    default: false, // Default value for is_premium is false
  },
  total_expense: {
    type: Number,
    default: 0, // Default value for total_expense is 0
  },
});

// Create a User model using the schema
const User = mongoose.model('User', userSchema);

export default User
