import * as types from "../constants/actionTypes";

/*
 * Action creators
 */

export function updateUserDetails() {
  return {
    type: types.UPDATE_USER_DETAILS
  };
}

export function updateUserPassword() {
  return {
    type: types.UPDATE_USER_PASSWORD
  };
}

export function updateGeneralPreferences() {
  return {
    type: types.UPDATE_GENERAL_PREFERENCES
  };
}

export function updateNotificationPreferences() {
  return {
    type: types.UPDATE_NOTIFICATION_PREFERENCES
  };
}

export function enableTwoFactorAuthentication() {
  return {
    type: types.ENABLE_TWO_FACTOR_AUTHENTICATION
  };
}

export function createApiKey() {
  return {
    type: types.CREATE_API_KEY
  };
}

export function deleteApiKey() {
  return {
    type: types.DELETE_API_KEY
  };
}

export function closeAccount() {
  return {
    type: types.CLOSE_ACCOUNT
  };
}
