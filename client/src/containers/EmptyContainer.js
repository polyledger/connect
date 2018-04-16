import { connect } from "react-redux";
import { addAlert, removeAlert } from "../actions/alertActions";
import EmptyLayout from "../components/EmptyLayout/EmptyLayout";

var mapStateToProps = state => {
  return {
    alerts: state.alerts
  };
};

const mapDispatchToProps = dispatch => ({
  addAlert: (text, style, icon) => dispatch(addAlert(text, style, icon)),
  removeAlert: id => dispatch(removeAlert(id))
});

const EmptyContainer = connect(mapStateToProps, mapDispatchToProps)(
  EmptyLayout
);

export default EmptyContainer;
