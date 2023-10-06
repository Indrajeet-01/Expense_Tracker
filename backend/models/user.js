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
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  is_premium: {
    type: Boolean,
    default: false, 
  },
  total_expense: {
    type: Number,
    default: 0, 
  },
});


const User = mongoose.model('User', userSchema);

export default User
