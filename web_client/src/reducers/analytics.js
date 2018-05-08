import * as types from "../constants/actionTypes";

const initialState = {};

export default function analytics(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_PORTFOLIO_BENCHMARKS:
      return {};
    case types.FETCH_PORTFOLIO_METRICS:
      return {};

    default:
      return state;
  }
}
