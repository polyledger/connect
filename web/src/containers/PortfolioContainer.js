import { connect } from "react-redux";
import { fetchPositions } from "../actions/portfolioActions";
import Portfolio from "../components/Portfolio/Portfolio";

const mapStateToProps = state => {
  return state.portfolio;
};

const mapDispatchToProps = dispatch => ({
  fetchPositions: () => {
    dispatch(fetchPositions());
  }
});

const PortfolioContainer = connect(mapStateToProps, mapDispatchToProps)(
  Portfolio
);

export default PortfolioContainer;
