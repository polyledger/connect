import * as types from "../constants/actionTypes";

/*
 * Action creators
 */

export function fetchMarkets(coins) {
  return {
    type: types.FETCH_MARKETS,
    coins
  };
}
