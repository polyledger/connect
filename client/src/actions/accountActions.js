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
        let connectedExchanges = json.connected_exchanges;
        dispatch(receiveConnectedExchanges(connectedExchanges));
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}

export function requestConnectedAddresses() {
  return {
    type: types.REQUEST_CONNECTED_ADDRESSES
  };
}

export function receiveConnectedAddresses(connectedAddresses) {
  return {
    type: types.RECEIVE_CONNECTED_ADDRESSES,
    connectedAddresses
  };
}

export function fetchConnectedAddresses() {
  return (dispatch, getState) => {
    dispatch(requestConnectedAddresses());
    const auth = getState().auth;
    const { token } = auth;
    return fetch(`/api/connected_addresses/`, {
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
        let connectedAddresses = json.connected_addresses;
        dispatch(receiveConnectedAddresses(connectedAddresses));
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

export function requestAssets() {
  return {
    type: types.REQUEST_ASSETS
  };
}

export function receiveAssets(assets) {
  return {
    type: types.RECEIVE_ASSETS,
    assets
  };
}

export function fetchAssets() {
  return (dispatch, getState) => {
    dispatch(requestAssets());
    const auth = getState().auth;
    const { token } = auth;
    return fetch(`/api/assets`, {
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
        console.log(json);
        let assets = json.assets;
        dispatch(receiveAssets(assets));
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}

export function connectExchange(exchangeId, apiKey, secret) {
  return (dispatch, getState) => {
    const auth = getState().auth;
    const { token } = auth;
    return fetch(`/api/connected_exchanges/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        exchange_id: exchangeId,
        api_key: apiKey,
        secret: secret
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(json => {
        let connectedExchangeId = json.connected_exchange_id;
        dispatch(addAlert("Connected exchange successfully.", "success"));
        dispatch(fetchConnectedExchanges());
        dispatch(connectExchangeSuccess(connectedExchangeId));
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}

export function connectExchangeSuccess(exchangeId) {
  return {
    type: types.CONNECT_EXCHANGE_SUCCESS,
    exchangeId
  };
}

export function connectAddress(addressId, apiKey, secret) {
  return (dispatch, getState) => {
    const auth = getState().auth;
    const { token } = auth;
    return fetch(`/api/connected_addresses/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address_id: addressId,
        api_key: apiKey,
        secret: secret
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(json => {
        let connectedAddressId = json.connected_address_id;
        dispatch(addAlert("Connected address successfully.", "success"));
        dispatch(fetchConnectedAddresses());
        dispatch(connectAddressSuccess(connectedAddressId));
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}

export function connectAddressSuccess(addressId) {
  return {
    type: types.CONNECT_ADDRESS_SUCCESS,
    addressId
  };
}

export function disconnectExchange(exchangeId) {
  return (dispatch, getState) => {
    const auth = getState().auth;
    const { token } = auth;
    return fetch(`/api/connected_exchanges/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        exchange_id: exchangeId
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(json => {
        dispatch(disconnectExchangeSuccess(exchangeId));
        dispatch(addAlert("Disconnected exchange successfully.", "success"));
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}

export function disconnectExchangeSuccess(exchangeId) {
  return {
    type: types.DISCONNECT_EXCHANGE_SUCCESS,
    exchangeId
  };
}

export function disconnectAddress(addressId) {
  return (dispatch, getState) => {
    const auth = getState().auth;
    const { token } = auth;
    return fetch(`/api/connected_addresses/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address_id: addressId
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(json => {
        dispatch(disconnectAddressSuccess(addressId));
        dispatch(addAlert("Disconnected address successfully.", "success"));
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}

export function disconnectAddressSuccess(addressId) {
  return {
    type: types.DISCONNECT_ADDRESS_SUCCESS,
    addressId
  };
}
