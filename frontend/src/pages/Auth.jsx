// components/RegistrationLoginForm.js
import '../styles/auth.css'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser, clearMessage } from '../contexts/actions/user';

const Auth = () => {
  const dispatch = useDispatch();
  const { message, messageType } = useSelector((state) => state.user);

  const [isNewUser, setIsNewUser] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const handleClearMessage = () => {
    dispatch(clearMessage());
  };

  const toggleForm = () => {
    setIsNewUser(!isNewUser);
    setFormData({
      name: '',
      email: '',
      password: '',
    });
  };

  return (
    <div>
      {isNewUser ? (
        <form id="registrationForm" onSubmit={handleRegister}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
          </label>
          <button type="submit">Register</button>
        </form>
      ) : (
        <form id="loginForm" onSubmit={handleLogin}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
          </label>
          <button type="submit">Login</button>
          <a href="/forgot-password">Forgot Password?</a>
        </form>
      )}

      <button onClick={toggleForm}>
        {isNewUser ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </button>

      {message && (
        <div className={messageType} onClick={handleClearMessage}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Auth;
