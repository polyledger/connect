import * as types from "../constants/actionTypes";

const initialState = {
  isFetching: false,
  connectedExchanges: [],
  connectedAddresses: [],
  exchanges: []
};

export default function accounts(state = initialState, action) {
  switch (action.type) {
    case types.REQUEST_CONNECTED_EXCHANGES:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.RECEIVE_CONNECTED_EXCHANGES:
      return Object.assign({}, state, {
        isFetching: false,
        connectedExchanges: action.connectedExchanges
      });
    case types.REQUEST_EXCHANGES:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.RECEIVE_EXCHANGES:
      return Object.assign({}, state, {
        isFetching: false,
        exchanges: action.exchanges
      });
    case types.CONNECT_EXCHANGE_SUCCESS:
      return Object.assign({}, state, {});
    case types.DISCONNECT_EXCHANGE_SUCCESS:
      let connectedExchanges = state.connectedExchanges.filter(exchange => {
        return exchange.id !== action.exchangeId;
      });
      return Object.assign({}, state, { connectedExchanges });

    default:
      return state;
  }
}
