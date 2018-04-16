import * as types from "../constants/actionTypes";
import { addAlert } from "./alertActions";

/*
 * Action creators
 */

export function login(credentials) {
  return {
    type: types.LOGIN
  };
}

export function signup(credentials) {
  return dispatch => {
    fetch(`/api/users/`, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(json => {
        return {
          type: types.SIGNUP
        };
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}

export function activate() {
  return {
    type: types.ACTIVATE
  };
}

export function logout() {
  return {
    type: types.LOGOUT
  };
}
