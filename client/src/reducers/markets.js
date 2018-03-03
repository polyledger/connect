import * as types from "../constants/actionTypes";

const initialState = {
  tickers: []
};

export default function markets(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_TICKERS:
      return {
        tickers: []
      };

    default:
      return state;
  }
}
