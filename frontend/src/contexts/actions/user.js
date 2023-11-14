// redux/actions/userActions.js

import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SET_MESSAGE,
  
  SET_TOKEN,
  LOGOUT,
  SET_IS_PREMIUM,
  
} from '../constants/user'

export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:8800/user/register", userData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: response.data,
    });

    dispatch({
      type: SET_MESSAGE,
      payload: "User registered successfully!",
    });
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
      payload: error.response.data.message || "Registration failed.",
    });
  }
};

export const loginUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:8800/user/login", userData);

    dispatch({
      type: LOGIN_SUCCESS, 
      payload: response.data,
    });

    dispatch({
        type: SET_TOKEN, // New action type to set the token
        payload: response.data.access_token,
      });

    dispatch({
      type: SET_IS_PREMIUM,
      payload: response.data.is_premium
    })
    localStorage.setItem("access_token", response.data.access_token);

    
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data || "Login failed.",
    });
  }
};

export const logoutUser = (token) => async (dispatch) => {
  try {
    // Send a logout request to the server
    await axios.post('http://localhost:8800/user/logout', null, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Dispatch the LOGOUT action
    dispatch({
      type: LOGOUT,
    });
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

