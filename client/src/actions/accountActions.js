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

export function fetchExchanges() {
  return (dispatch, getState) => {
    dispatch(requestExchanges());
    const auth = getState().auth;
    const { token } = auth;
    return fetch(`/api/exchanges/`, {
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
        let exchanges = json.exchanges;
        dispatch(receiveExchanges(exchanges));
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}

export function createConnectedExchange() {
  return {
    type: types.CREATE_CONNECTED_EXCHANGE
  };
}

export function receiveConnectedExchange(exchange) {
  return {
    type: types.RECEIVE_CONNECTED_EXCHANGE,
    exchange
  };
}

export function connectExchange(id) {
  return (dispatch, getState) => {
    dispatch(createConnectedExchange());
    const auth = getState().auth;
    const { token } = auth;
    return fetch(`/api/connected_exchanges/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        exchange_id: id
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(json => {
        // let exchange = json.exchange;
        console.log(json);
        dispatch(receiveConnectedExchange(json));
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}
