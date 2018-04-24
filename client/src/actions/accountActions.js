import * as types from "../constants/actionTypes";
import { addAlert } from "./alertActions";

/*
 * Action creators
 */

export function requestConnectedExchanges() {
  return {
    type: types.REQUEST_CONNECTED_EXCHANGES
  };
}

export function receiveConnectedExchanges(connectedExchanges) {
  return {
    type: types.RECEIVE_CONNECTED_EXCHANGES,
    connectedExchanges
  };
}

export function fetchConnectedExchanges() {
  return (dispatch, getState) => {
    dispatch(requestConnectedExchanges());
    const auth = getState().auth;
    const { token } = auth;
    // const { id } = auth.user;
    return fetch(`/api/connected_exchanges/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(json => {
        dispatch(receiveConnectedExchanges(json));
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}

export function requestExchanges() {
  return {
    type: types.REQUEST_EXCHANGES
  };
}

export function receiveExchanges(exchanges) {
  return {
    type: types.RECEIVE_EXCHANGES,
    exchanges
  };
}

export function fetchExchanges() {}

export function connectExchange() {
  return {
    type: types.CONNECT_EXCHANGE
  };
}
