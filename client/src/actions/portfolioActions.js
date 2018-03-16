import * as types from "../constants/actionTypes";

/*
 * Action creators
 */

export function fetchPortfolio() {
  return {
    type: types.FETCH_PORTFOLIO
  };
}

export function fetchPortfolioChart() {
  return {
    type: types.FETCH_PORTFOLIO_CHART
  };
}
