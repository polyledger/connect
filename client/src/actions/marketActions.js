import * as types from "../constants/actionTypes";

/*
 * Action creators
 */

export function loadTickers(coins) {
  return {
    type: types.LOAD_TICKERS,
    coins
  };
}
