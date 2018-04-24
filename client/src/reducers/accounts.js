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
        isFetching: false
      });
    case types.REQUEST_EXCHANGES:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.RECEIVE_EXCHANGES:
      return Object.assign({}, state, {
        isFetching: false
      });
    case types.CONNECT_EXCHANGE:
      return {};

    default:
      return state;
  }
}
