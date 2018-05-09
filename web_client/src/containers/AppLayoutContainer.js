import { connect } from "react-redux";
import AppLayout from "../components/AppLayout/AppLayout";

const mapStateToProps = state => {
  return state;
};

const AppLayoutContainer = connect(mapStateToProps)(AppLayout);

export default AppLayoutContainer;
