import * as types from "../constants/actionTypes";

const initialState = {};

export default function portfolio(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_PORTFOLIO:
      return {};
    case types.FETCH_PORTFOLIO_CHART:
      return {};

    default:
      return state;
  }
}
