import { connect } from "react-redux";
import { addAlert, removeAlert } from "../actions/alertActions";
import AppLayout from "../components/AppLayout/AppLayout";

var mapStateToProps = state => {
  return {
    alerts: state.alerts
  };
};

const mapDispatchToProps = dispatch => ({
  addAlert: (text, style, icon) => dispatch(addAlert(text, style, icon)),
  removeAlert: id => dispatch(removeAlert(id))
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(AppLayout);

export default AppContainer;
