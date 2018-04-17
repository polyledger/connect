import * as types from "../constants/actionTypes";

const initialState = {
  isSignedUp: false,
  isLoggedIn: false
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN:
      return {};
    case types.SIGNUP:
      console.log(action);
      return Object.assign({}, state, {
        isSignedUp: true
      });
    case types.LOGOUT:
      return {};
    case types.ACTIVATE:
      return {};

    default:
      return state;
  }
}
