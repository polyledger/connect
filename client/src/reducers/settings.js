import * as types from "../constants/actionTypes";

const initialState = {
  isFetching: false,
  emailNotification: "",
  localCurrency: "",
  timeZone: "",
  twoFactorEnabled: false
};

export default function settings(state = initialState, action) {
  switch (action.type) {
    case types.REQUEST_SETTINGS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.RECEIVE_SETTINGS:
      return Object.assign({}, state, action.settings, {
        isFetching: false
      });
    case types.UPDATE_PERSONAL_DETAILS:
      return {};
    case types.UPDATE_PASSWORD:
      return {};
    case types.UPDATE_GENERAL_PREFERENCES:
      return {};
    case types.UPDATE_NOTIFICATION_PREFERENCES:
      return {};
    case types.ENABLE_TWO_FACTOR_AUTHENTICATION:
      return {};
    case types.CREATE_API_KEY:
      return {};
    case types.DELETE_API_KEY:
      return {};
    case types.CLOSE_ACCOUNT:
      return {};

    default:
      return state;
  }
}
