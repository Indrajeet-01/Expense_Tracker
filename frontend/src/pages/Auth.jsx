// components/RegistrationLoginForm.js
import '../styles/auth.css'
import React, { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { registerUser, loginUser, } from '../contexts/actions/user';

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  

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

    navigate('/')
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));

    navigate('/')
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
          <Link className='forgot-password' to="/send-email">Forgot Password?</Link>
        </form>
      )}

      <button onClick={toggleForm}>
        {isNewUser ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </button>

      
    </div>
  );
};

export default Auth;
