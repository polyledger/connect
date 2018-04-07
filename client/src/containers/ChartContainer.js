import { connect } from "react-redux";
import ChartWrapper from "../components/ChartWrapper/ChartWrapper";

const mapStateToProps = state => {
  return state;
};

const ChartContainer = connect(mapStateToProps)(ChartWrapper);

export default ChartContainer;
