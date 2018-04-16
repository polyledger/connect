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
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(json => {
        // Authentication successful:
        // Change state isSignedUp to true
        // Redirect to email confirmation page
        console.log(json);
      })
      .catch(error => {
        console.log(error);
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
