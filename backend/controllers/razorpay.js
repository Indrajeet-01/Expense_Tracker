import Razorpay from 'razorpay'

import User from "../models/user.js"
import dotenv from 'dotenv'
dotenv.config()

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  
  // create order payment
  export const createOrder = async (req, res) => {
    const options = {
      amount: 1000, // Amount in paise (100 paise = 1 INR)
      currency: "INR",
      receipt: "order_receipt_1",
    };
  
    try {
      const order = await razorpay.orders.create(options);
  
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Unable to create order" });
    }
  };
  
  // check status of payment
  export const paymentStatus = async (req, res) => {
    const { payment_id, order_id, signature } = req.body;
  
    const isValidSignature = razorpay.webhooks.verifyPaymentSignature(
      JSON.stringify(req.body),
      signature
    );
  
    if (isValidSignature) {
      const userId = req.user.id;
  
      try {
        // Update the user's ispremium field to indicate premium membership
        await User.findByIdAndUpdate(userId, { ispremium: true });
  
        res.status(200).json("updated successfully");
      } catch (error) {
        console.error('Error updating user ispremium status:', error);
        res.status(500).json({ error: 'Failed to update user status.' });
      }
  
      // You can update your database or perform other actions here
      res.status(200).send("Payment successful");
    } else {
      res.status(400).send("Invalid signature");
    }
  };