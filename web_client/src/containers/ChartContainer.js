import { connect } from "react-redux";
import { fetchPortfolio, fetchChartData } from "../actions/portfolioActions";
import ChartWrapper from "../components/Portfolio/ChartWrapper/ChartWrapper";

const mapStateToProps = state => {
  return state.portfolio;
};

const mapDispatchToProps = dispatch => ({
  fetchPortfolio: () => dispatch(fetchPortfolio()),
  fetchChartData: period => dispatch(fetchChartData(period))
});

const ChartContainer = connect(mapStateToProps, mapDispatchToProps)(
  ChartWrapper
);

export default ChartContainer;
