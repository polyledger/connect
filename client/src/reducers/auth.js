import * as types from "../constants/actionTypes";

const initialState = {
  isFetching: false,
  isSignedUp: false,
  isLoggedIn: false,
  user: {}
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN:
      return {};
    case types.SIGNUP_START:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.SIGNUP_END:
      return Object.assign({}, state, {
        isFetching: false,
        isSignedUp: true,
        user: action.user
      });
    case types.LOGOUT:
      return {};
    case types.ACTIVATE:
      return {};

    default:
      return state;
  }
}
