import * as types from "../constants/actionTypes";

/*
 * Action creators
 */

export function login() {
  return {
    type: types.LOGIN
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
