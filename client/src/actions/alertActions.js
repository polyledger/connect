import * as types from "../constants/actionTypes";

/*
 * Action creators
 */

/*
 * Display an alert
 */
export function addAlert(text, style, icon) {
  return {
    type: types.ADD_ALERT,
    text,
    style,
    icon
  };
}

/*
 * Remove an alert
 */
export function removeAlert(id) {
  return {
    type: types.REMOVE_ALERT,
    id
  };
}

/*
 * Clear alerts
 */
export function clearAlerts() {
  return {
    type: types.CLEAR_ALERTS
  };
}
