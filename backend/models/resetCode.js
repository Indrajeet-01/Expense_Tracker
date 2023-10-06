import mongoose from "mongoose";

const resetCodeSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  });
  
  const ResetCode = mongoose.model('ResetCode', resetCodeSchema);

export default ResetCode