import * as types from "../constants/actionTypes";
import { addAlert } from "./alertActions";

/*
 * Action creators
 */

export function login(credentials) {
  return dispatch => {
    dispatch(loginStart());
    return fetch(`/api/authenticate/`, {
      method: "POST",
      body: JSON.stringify({
        username: credentials.email,
        password: credentials.password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok || response.status === 400) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(json => {
        if (json.hasOwnProperty("errors")) {
          for (let error of json.errors) {
            dispatch(addAlert(error.message, "danger"));
          }
          dispatch(loginFailure());
        } else {
          let token = json.token;
          let user = json.user;

          if (credentials.remember) {
            localStorage.setItem("token", token);
          }
          dispatch(loginSuccess(token, user));
        }
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}

export function loginStart(credentials) {
  return dispatch => {
    dispatch(
      addAlert(
        "Secure login initiated. Sending authentication signature to server...",
        "info",
        "lock"
      )
    );
    return {
      type: types.LOGIN_START
    };
  };
}

export function loginSuccess(token, user) {
  return {
    type: types.LOGIN_SUCCESS,
    token,
    user
  };
}

export function loginFailure() {
  return {
    type: types.LOGIN_FAILURE
  };
}

/*
 * Sign up a user.
 */
export function signup(credentials) {
  return dispatch => {
    dispatch(signupStart());
    return fetch(`/api/users/`, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok || response.status === 400) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(json => {
        if (json.hasOwnProperty("errors")) {
          for (let error of json.errors) {
            dispatch(addAlert(error.message, "danger"));
          }
          dispatch(signupFailure());
        } else {
          dispatch(signupSuccess(json));
        }
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}

export function signupStart(credentials) {
  return {
    type: types.SIGNUP_START
  };
}

export function signupSuccess(user) {
  return {
    type: types.SIGNUP_SUCCESS,
    user
  };
}

export function signupFailure() {
  return {
    type: types.SIGNUP_FAILURE
  };
}

export function activate(token) {
  return {
    type: types.ACTIVATE,
    token
  };
}

export function logout() {
  return {
    type: types.LOGOUT
  };
}
