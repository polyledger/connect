import { connect } from "react-redux";
import { addAlert, removeAlert } from "../actions/alertActions";
import AlertList from "../components/App/AlertList/AlertList";

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => ({
  AddAlert: () => dispatch(addAlert()),
  removeAlert: index => dispatch(removeAlert(index))
});

const AlertContainer = connect(mapStateToProps, mapDispatchToProps)(AlertList);

export default AlertContainer;
