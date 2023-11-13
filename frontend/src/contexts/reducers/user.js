// redux/reducers/userReducer.js

import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    SET_MESSAGE,
    CLEAR_MESSAGE,
    SET_TOKEN,
    LOGOUT,
    SET_IS_PREMIUM,
  } from '../constants/user';
  
  const initialState = {
    message: '',
    messageType: '',
    token: null,
    is_premium: false,
  };
  
  const userReducer = (state = initialState, action) => {

    console.log('Action:', action.type);
  console.log('Current State:', state);

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
      
        case SET_TOKEN: // Handle setting the token in the state
        return {
          ...state,
          token: action.payload,
        };
      
        case LOGOUT:
          return {
            ...state,
            token: '',
            
          };
        case SET_IS_PREMIUM:
          return {
            ...state,
            is_premium: action.payload,
          };
      default:
        return state;
    }
  };
  
  export default userReducer;
  