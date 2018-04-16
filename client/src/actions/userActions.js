import * as types from "../constants/actionTypes";

/*
 * Action creators
 */

export function login(credentials) {
  return dispatch => {
    fetch(`/api/users/`, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(
        response => {
          return response.json();
        },
        error => {
          return error;
        }
      )
      .then(json => {
        console.log(json);
      });
  };
}

export function signup() {
  return {
    type: types.SIGNUP
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
