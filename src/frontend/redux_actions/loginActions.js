import axios from 'axios';
import jwt from 'jwt-decode';

import setHeaders from '../utils/setHeaders';
import {
  TYPES
} from '../redux_actions/types';

export const login = (data) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/auth',
      data: data,
      headers: setHeaders(),
    });

    if (res.status === 203) {
      localStorage.setItem('email', data.email);
      dispatch({
        type: TYPES.LOGIN,
        loginData: {
          emailVerified: false,
          invalidData: true
        },
      });
    } else if (res.status === 200) {
      const token = res.headers["x-auth-token"];
      localStorage.setItem('token', token);
      localStorage.setItem('id', jwt(token)._id);
      dispatch({
        type: TYPES.LOGIN,
        isLogged: true
      });
    } else {
      dispatch({
        type: TYPES.LOGIN,
        loginData: {
          invalidData: true
        },
      });
    }

  } catch (error) {
    console.error('Error Login:', error.response.data);
    dispatch({
      type: TYPES.LOGIN,
      loginData: {
        emailVerified: true,
        invalidData: true
      },
    });
  }
};

export const loginExternal = (authObject) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/authexternal',
      data: {token: authObject.currentUser.get().getAuthResponse().id_token},
  });

    if (res.status === 200) {
      const token = res.headers["x-auth-token"];
      localStorage.setItem('token', token);
      localStorage.setItem('id', jwt(token)._id);
      dispatch({
        type: TYPES.LOGINEXTERNAL,
        isLogged: true
      });
    } else if (res.status === 202) {
      dispatch({
        type: TYPES.LOGINEXTERNAL,
        isLogged: false,
        createNewExternalUser: true,
        newExternalUserData: res.body
      });
    } 

  } catch (error) {
    console.error('Error Login:', error.response.data);
    dispatch({
      type: TYPES.LOGINEXTERNAL,
      loginData: {
        emailVerified: true,
        invalidData: true,
      },
      createNewExternalUser: true,
    });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({
    type: TYPES.LOGOUT,
    loginData: {
      email: '',
      password: '',
      emailVerified: true,
      invalidData: false
    },
    isLogged: false,
    me: {}
  });
};

export const myData = () => async (dispatch) => {
  try {
    const response = await axios({
      url: "/api/users/me",
      method: "GET",
      headers: setHeaders()
    });
    if (response.status === 400) {
      localStorage.removeItem("token");

      dispatch({
        type: TYPES.GETMYDATA,
        isLogged: true,
        me: {},
      });
      return;
    }
    const data = await response.data;
    dispatch({
      type: TYPES.GETMYDATA,
      isLogged: true,
      me: data,
    });
  } catch (ex) {
    console.error("Serwer nie odpowiada");
    console.error("Error", ex);
  }

};