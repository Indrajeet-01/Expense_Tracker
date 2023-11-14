import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SendEmail = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [updatePasswordLinkVisible, setUpdatePasswordLinkVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8800/user/sendEmail", { email });

      if (response.status === 200) {
        setMessage("Reset code sent successfully. Check your email.");
        setUpdatePasswordLinkVisible(true);
      } else {
        setMessage(response.data.message || "Failed to send reset code.");
      }
    } catch (error) {
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="container">
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Send Reset Code</button>
      </form>
      <p className={message ? (message.includes('successfully') ? 'success' : 'error') : 'hidden'}>
        {message}
      </p>

      {updatePasswordLinkVisible && (
        <p>
          Reset code sent successfully.{' '}
          <Link to="/update-password">Click here</Link> to update your password.
        </p>
      )}
    </div>
  );
};

export default SendEmail;
