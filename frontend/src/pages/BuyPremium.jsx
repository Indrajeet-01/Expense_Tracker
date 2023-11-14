
import React, { useState } from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux'

const razorpayKey = 'rzp_test_i99EOMZqK9w3qF';

const BuyPremium = () => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const token = useSelector(state => state.user.token);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const orderResponse = await axios.post(
        'http://localhost:8800/payment/createOrder',
        {
          amount: amount * 100,
          currency: 'INR',
          name: 'Your Company Name',
          description: 'Payment for a premium membership',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const orderData = orderResponse.data;

      // Initialize Razorpay
      const rzp = new window.Razorpay({
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: orderData.name,
        description: orderData.description,
        order_id: orderData.id,
        handler: async function (response) {
          // Handle payment success
          try {
            const paymentSuccessResponse = await axios.post(
              'http://localhost:8800/payment/paymentSuccess',
              response,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            console.log(paymentSuccessResponse.data);
            // Redirect or show a success message to the user
          } catch (error) {
            console.error('Error processing payment success:', error);
          }
        },
      });

      // Open the Razorpay payment modal
      rzp.open();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="payment-form">
      <h1>Payment Details</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Buy Premium</button>
      </form>
    </div>
  );
};

export default BuyPremium;
