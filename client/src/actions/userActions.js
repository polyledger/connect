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

/*
 * Sign up a user.
 */
export function signup(credentials) {
  return dispatch => {
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
        console.log("initial json");
        console.log(json);
        if (json.status_code === 400) {
          for (let error of json.errors) {
            dispatch(addAlert(error.message, "danger"));
          }
        } else {
          // success
          console.log("success");
          console.log(json);
        }

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
