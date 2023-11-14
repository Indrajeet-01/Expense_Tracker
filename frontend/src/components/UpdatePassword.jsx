import React, { useState } from 'react';
import axios from 'axios';

const UpdatePassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8800/user/updatePassword", {
        email,
        code,
        newPassword,
      });

      if (response.status === 200) {
        setMessage("Password updated successfully!");

        setTimeout(() => {
          // Redirect to the login page after 2 seconds
          window.location.href = "/auth";
        }, 2000);
      } else {
        setMessage(response.data.message || "Failed to update password.");
      }
    } catch (error) {
      setMessage("An error occurred.");
    }

    setMessage('');
  };

  return (
    <div className="container">
      <h1>Update Password</h1>
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

        <label htmlFor="code">Reset Code:</label>
        <input
          type="text"
          id="code"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit">Update Password</button>
      </form>

      <p className={message ? (message.includes('successfully') ? 'success' : 'error') : 'hidden'}>
        {message}
      </p>
    </div>
  );
};

export default UpdatePassword;
