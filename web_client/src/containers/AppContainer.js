import { connect } from "react-redux";
import App from "../components/App/App";
import { clearAlerts } from "../actions/alertActions";

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => ({
  clearAlerts: () => dispatch(clearAlerts())
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
