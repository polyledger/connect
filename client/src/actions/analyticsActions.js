import * as types from "../constants/actionTypes";

/*
 * Action creators
 */

export function fetchPortfolioBenchmarks() {
  return {
    type: types.FETCH_PORTFOLIO_BENCHMARKS
  };
}

export function fetchPortfolioMetrics() {
  return {
    type: types.FETCH_PORTFOLIO_METRICS
  };
}
