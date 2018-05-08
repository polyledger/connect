import fetch from "cross-fetch";
import * as types from "../constants/actionTypes";
import { addAlert } from "./alertActions";

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

export function requestPositions() {
  return {
    type: types.REQUEST_POSITIONS
  };
}

export function receivePositions(positions) {
  return {
    type: types.RECEIVE_POSITIONS,
    positions
  };
}

export function fetchPositions() {
  return (dispatch, getState) => {
    dispatch(requestPositions());
    const auth = getState().auth;
    const { token } = auth;
    const { id } = auth.user.portfolio;
    fetch(`/api/portfolios/${id}/assets/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok || response.status === 400) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(json => {
        dispatch(receivePositions(json));
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}

/**
 * Fetch user's portfolio.
 */
export function fetchPortfolio() {
  return (dispatch, getState) => {
    dispatch(requestPortfolio());
    const auth = getState().auth;
    const { token } = auth;
    const { id } = auth.user.portfolio;
    return fetch(`/api/portfolios/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok || response.status === 400) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(json => {
        dispatch(receivePortfolio(json));
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
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
    const auth = getState().auth;
    const { token } = auth;
    const { id } = auth.user.portfolio;
    return fetch(`/api/portfolios/${id}/chart?period=${period}`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok || response.status === 400) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(json => {
        dispatch(receiveChartData(json));
      })
      .catch(error => {
        dispatch(addAlert(error.toString(), "danger"));
      });
  };
}
