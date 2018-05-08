import * as types from "../constants/actionTypes";

const initialState = {
  isFetching: false,
  isSignedUp: false,
  isLoggedIn: false,
  token: "",
  user: {
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    portfolio: {}
  }
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN_START:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isLoggedIn: true,
        token: action.token,
        user: {
          id: action.user.id,
          firstName: action.user.first_name,
          lastName: action.user.last_name,
          email: action.user.email,
          portfolio: action.user.portfolio
        }
      });
    case types.LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false
      });
    case types.SIGNUP_START:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.SIGNUP_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isSignedUp: true,
        user: {
          id: action.user.id,
          firstName: action.user.first_name,
          lastName: action.user.last_name,
          email: action.user.email,
          portfolio: action.user.portfolio
        }
      });
    case types.SIGNUP_FAILURE:
      return Object.assign({}, state, {
        isFetching: false
      });
    case types.LOGOUT:
      return Object.assign({}, state, {
        isLoggedIn: false,
        token: "",
        user: {
          id: null,
          firstName: "",
          lastName: "",
          email: "",
          portfolio: {}
        }
      });
    case types.ACTIVATE:
      return Object.assign({}, state, {
        isLoggedIn: true,
        isSignedUp: false,
        token: action.token
      });
    default:
      return state;
  }
}
