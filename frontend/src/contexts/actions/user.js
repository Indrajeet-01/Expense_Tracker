// redux/actions/userActions.js

import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SET_MESSAGE,
  CLEAR_MESSAGE,
  SET_TOKEN
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

    localStorage.setItem("access_token", response.data.access_token);

    dispatch({
      type: SET_MESSAGE,
      payload: "Login successful!",
    });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data || "Login failed.",
    });
  }
};

export const clearMessage = () => ({
  type: CLEAR_MESSAGE,
});
