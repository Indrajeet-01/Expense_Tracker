// redux/reducers/userReducer.js

import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    SET_MESSAGE,
    CLEAR_MESSAGE,
    SET_TOKEN,
  } from '../constants/user';
  
  const initialState = {
    message: '',
    messageType: '',
    token: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
        return {
          ...state,
          token: action.payload.access_token,
          message: action.payload,
          messageType: 'success',
        };
      case REGISTER_FAIL:
      case LOGIN_FAIL:
        return {
          ...state,
          message: action.payload,
          messageType: 'error',
        };
      case SET_MESSAGE:
        return {
          ...state,
          message: action.payload,
        };
        case SET_TOKEN: // Handle setting the token in the state
        return {
          ...state,
          token: action.payload,
        };
      case CLEAR_MESSAGE:
        return {
          ...state,
          message: '',
          messageType: '',
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  