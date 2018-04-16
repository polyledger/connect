import { connect } from "react-redux";
import { addAlert, removeAlert } from "../actions/alertActions";
import Alert from "../components/Alert/Alert";

const mapStateToProps = state => {
  return state.alerts;
};

const mapDispatchToProps = dispatch => ({
  showAlert: () => dispatch(addAlert()),
  removeAlert: index => dispatch(removeAlert(index))
});

const AlertContainer = connect(mapStateToProps, mapDispatchToProps)(Alert);

export default AlertContainer;
