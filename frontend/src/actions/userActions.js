import axios from 'axios';
import {
   GET_USER_RESET_PASSWORD_FAIL,
   GET_USER_RESET_PASSWORD_REQUEST,
   GET_USER_RESET_PASSWORD_SUCCESS,
   USER_LOGIN_FAIL,
   USER_LOGIN_REQUEST,
   USER_LOGIN_SUCCESS,
   USER_LOGOUT,
   USER_REGISTER_FAIL,
   USER_REGISTER_REQUEST,
   USER_REGISTER_SUCCESS,
   USER_RESET_PASSWORD_FAIL,
   USER_RESET_PASSWORD_REQUEST,
   USER_RESET_PASSWORD_SUCCESS,
   USER_UPDATE_FAIL,
   USER_UPDATE_REQUEST,
   USER_UPDATE_RESET,
   USER_UPDATE_SUCCESS,
} from '../constants/userConstants';
import { returnErrors } from './errorActions';

export const loginUser = (user) => (dispatch) => {
   dispatch({ type: USER_LOGIN_REQUEST });

   const config = {
      headers: {
         'Content-type': 'application/json',
      },
   };

   axios
      .post('/api/users/auth', user, config)
      .then((res) => {
         dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: res.data,
         });

         dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: res.data,
         });

         localStorage.setItem('user', JSON.stringify(res.data.user));
         localStorage.setItem('token', JSON.stringify(res.data.token));
      })
      .catch((err) => {
         dispatch(returnErrors(err.response.data.msg));
         dispatch({ type: USER_LOGIN_FAIL });
      });
};

export const registerUser = (user) => (dispatch) => {
   dispatch({ type: USER_REGISTER_REQUEST });

   const config = {
      headers: {
         'Content-type': 'application/json',
      },
   };

   axios
      .post('/api/users', user, config)
      .then((res) => {
         dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: res.data,
         });

         dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: res.data,
         });

         localStorage.setItem('user', JSON.stringify(res.data.user));
         localStorage.setItem('token', JSON.stringify(res.data.token));
      })
      .catch((err) => {
         dispatch(returnErrors(err.response.data.msg));
         dispatch({ type: USER_REGISTER_FAIL });
      });
};

export const forgotPassword = (emailObj) => (dispatch) => {
   dispatch({ type: GET_USER_RESET_PASSWORD_REQUEST });

   const config = {
      headers: {
         'Content-type': 'application/json',
      },
   };

   axios
      .post('/api/password-reset', emailObj, config)
      .then((res) => {
         dispatch({
            type: GET_USER_RESET_PASSWORD_SUCCESS,
            payload: res.data,
         });
      })
      .catch((err) => {
         dispatch(returnErrors(err.response.data.msg));
         dispatch({ type: GET_USER_RESET_PASSWORD_FAIL });
      });
};

export const resetPassword = (url, passwordObj) => (dispatch) => {
   dispatch({ type: USER_RESET_PASSWORD_REQUEST });

   const config = {
      headers: {
         'Content-type': 'application/json',
      },
   };

   axios
      .post(url, passwordObj, config)
      .then((res) => {
         dispatch({
            type: USER_RESET_PASSWORD_SUCCESS,
            payload: res.data,
         });
         window.location = '/login/redirect=/';
      })
      .catch((err) => {
         dispatch(returnErrors(err.response.data.msg));
         dispatch({ type: USER_RESET_PASSWORD_FAIL });
      });
};

export const updateUser = (user) => (dispatch, getState) => {
   dispatch({ type: USER_UPDATE_REQUEST });

   axios
      .put('/api/users', user, tokenConfig(getState))
      .then((res) => {
         dispatch({
            type: USER_UPDATE_SUCCESS,
            payload: res.data,
         });

         dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: res.data,
         });

         dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: res.data,
         });

         localStorage.setItem('user', JSON.stringify(res.data.user));
         localStorage.setItem('token', JSON.stringify(res.data.token));

         dispatch({ type: USER_UPDATE_RESET });
      })
      .catch((err) => {
         dispatch(returnErrors(err.response.data.msg));
         dispatch({ type: USER_UPDATE_FAIL });
      });
};

export const logoutUser = () => (dispatch) => {
   dispatch({ type: USER_LOGOUT });

   localStorage.removeItem('user');
   localStorage.removeItem('token');
   localStorage.removeItem('cartItems');
   localStorage.removeItem('shippingItems');
   localStorage.removeItem('paymentMethod');
   localStorage.removeItem('shippingAddress');

   document.location.href = '/login/redirect=/';
};

export const tokenConfig = (getState) => {
   const token = getState().login.token;

   const config = {
      headers: {
         'Content-type': 'application/json',
      },
   };

   if (token) {
      config.headers['x-auth-token'] = token;
   }

   return config;
};
