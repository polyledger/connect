import * as types from "../constants/actionTypes";
import { addAlert } from "./alertActions";

/*
 * Action creators
 */

export function requestSettings() {
  return {
    type: types.REQUEST_SETTINGS
  };
}

export function receiveSettings(settings) {
  return {
    type: types.RECEIVE_SETTINGS,
    settings
  };
}

export function fetchSettings() {
  return (dispatch, getState) => {
    dispatch(requestSettings());
    const { token } = getState().auth;
    return fetch(`/api/settings/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(json => {
        dispatch(receiveSettings(json));
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}

export function updatePersonalDetails(personalDetails) {
  return (dispatch, getState) => {
    const { token, user } = getState().auth;
    return fetch(`/api/users/${user.id}/set_personal_details/`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(personalDetails)
    })
      .then(response => {
        if (response.ok) {
          const message = "Your personal details have been updated.";
          dispatch(addAlert(message, "success"));
          return {
            type: types.UPDATE_PERSONAL_DETAILS
          };
        } else if (response.status === 400) {
          return response.json().then(json => {
            for (let error of json.errors) {
              dispatch(addAlert(error.message, "danger"));
            }
          });
        }
        throw new Error(response.statusText);
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}

export function updatePassword(passwords) {
  return (dispatch, getState) => {
    const { token, user } = getState().auth;
    return fetch(`/api/users/${user.id}/set_password/`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(passwords)
    })
      .then(response => {
        if (response.ok) {
          const message = "Your password has been updated.";
          dispatch(addAlert(message, "success"));
          return {
            type: types.UPDATE_PASSWORD
          };
        } else if (response.status === 400) {
          return response.json().then(json => {
            for (let error of json.errors) {
              dispatch(addAlert(error.message, "danger"));
            }
          });
        }
        throw new Error(response.statusText);
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
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
