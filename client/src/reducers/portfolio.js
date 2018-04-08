import * as types from "../constants/actionTypes";

const initialState = {
  isFetching: false,
  chart: {
    isFetching: true,
    period: "7D"
  }
};

export default function portfolio(state = initialState, action) {
  let chart;

  switch (action.type) {
    case types.REQUEST_PORTFOLIO:
      return Object.assign({}, state, {
        isFetching: true
      });
    case types.RECEIVE_PORTFOLIO:
      return Object.assign({}, state, {
        isFetching: false,
        ...action.portfolio
      });
    case types.REQUEST_CHART_DATA:
      return Object.assign({}, state, {
        chart: {
          isFetching: true,
          period: action.period
        }
      });
    case types.RECEIVE_CHART_DATA:
      chart = Object.assign({}, state.chart, {
        isFetching: false,
        ...action.chartData
      });
      return Object.assign({}, state, {
        chart: chart
      });
    default:
      return state;
  }
}
