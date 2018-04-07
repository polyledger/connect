import * as types from "../constants/actionTypes";

const initialState = {
  isFetching: false,
  data: []
};

export default function portfolio(state = initialState, action) {
  switch (action.type) {
    case types.REQUEST_PORTFOLIO:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.RECEIVE_PORTFOLIO:
      return Object.assign({}, state, {
        isFetching: false,
        portfolio: action.portfolio
      });
    case types.REQUEST_CHART_DATA:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.RECEIVE_CHART_DATA:
      return Object.assign({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
}
