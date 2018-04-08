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
export function receivePortfolio(portfolio) {
  return {
    type: types.RECEIVE_PORTFOLIO,
    portfolio
  };
}

/**
 * Fetch user's portfolio.
 */
export function fetchPortfolio() {
  return dispatch => {
    dispatch(requestPortfolio());
    return fetch(`/api/portfolios/current`)
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
export function requestChartData(period) {
  return {
    type: types.REQUEST_CHART_DATA,
    period
  };
}

/**
 * Receive chart data.
 */
export function receiveChartData(chartData) {
  return {
    type: types.RECEIVE_CHART_DATA,
    chartData
  };
}

/**
 * Fetch user portfolio's chart data.
 */
export function fetchChartData(period) {
  return (dispatch, getState) => {
    dispatch(requestChartData(period));
    const { id } = getState().user;
    return fetch(`/api/portfolios/${id}/chart?period=${period}`)
      .then(
        response => {
          return response.json();
        },
        error => {
          return error;
        }
      )
      .then(json => {
        dispatch(receiveChartData(json));
      });
  };
}
