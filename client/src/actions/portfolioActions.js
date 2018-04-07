import fetch from "cross-fetch";
import * as types from "../constants/actionTypes";

/*
 * Action creators
 */

/**
 * Request the user's portfolio.
 */
export function requestPortfolio() {
  return {
    type: types.REQUEST_PORTFOLIO
  };
}

/**
 * Receive the user's portfolio.
 */
export function receivePortfolio(json) {
  return {
    type: types.RECEIVE_PORTFOLIO,
    portfolio: json.data.portfolio
  };
}

/**
 * Fetch user's portfolio.
 */
export function fetchPortfolio() {
  return dispatch => {
    dispatch(requestPortfolio());
    return fetch(`/api/portfolios`)
      .then(
        response => {
          return response.json();
        },
        error => {
          return error;
        }
      )
      .then(json => dispatch(receivePortfolio(json)));
  };
}

/**
 * Request chart data.
 */
export function requestChartData() {
  return {
    type: types.REQUEST_CHART_DATA
  };
}

/**
 * Receive chart data.
 */
export function receiveChartData(json) {
  return {
    type: types.REQUEST_CHART_DATA,
    data: json.data
  };
}

/**
 * Fetch user portfolio's chart data.
 */
export function fetchChartData() {
  return function(dispatch) {
    dispatch(requestChartData());
    return fetch(`/api/portfolios/1/chart`)
      .then(
        response => {
          return response.json();
        },
        error => {
          return error;
        }
      )
      .then(json => dispatch(receiveChartData(json)));
  };
}
