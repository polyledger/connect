import { connect } from "react-redux";
import { addAlert } from "../actions/alertActions";
import { login } from "../actions/userActions";
import Signup from "../components/Signup/Signup";

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => ({
  addAlert: (text, type, icon) => dispatch(addAlert(text, type, icon)),
  login: credentials => dispatch(login(credentials))
});

const SignupContainer = connect(mapStateToProps, mapDispatchToProps)(Signup);

export default SignupContainer;
