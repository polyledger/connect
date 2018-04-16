import { connect } from "react-redux";
import { addAlert, removeAlert } from "../actions/alertActions";
import AlertOverlay from "../components/AlertOverlay/AlertOverlay";

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => ({
  showAlert: () => dispatch(addAlert()),
  removeAlert: index => dispatch(removeAlert(index))
});

const AlertContainer = connect(mapStateToProps, mapDispatchToProps)(
  AlertOverlay
);

export default AlertContainer;
