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
          emailVerified: false
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
    console.error('Error Login:', error);
    dispatch({
      type: TYPES.LOGIN,
      loginData: {
        invalidData: true
      },
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