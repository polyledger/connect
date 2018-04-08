import * as types from "../constants/actionTypes";

const initialState = {
  pending: false,
  isSignedUp: false,
  isLoggedIn: false
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN:
      return {};
    case types.SIGNUP:
      return {};
    case types.LOGOUT:
      return {};
    case types.ACTIVATE:
      return {};

    default:
      return state;
  }
}
