import { connect } from "react-redux";
import { addAlert } from "../actions/alertActions";
import { signup } from "../actions/authActions";
import Signup from "../components/Signup/Signup";

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => ({
  addAlert: (text, type, icon) => dispatch(addAlert(text, type, icon)),
  signup: credentials => dispatch(signup(credentials))
});

const SignupContainer = connect(mapStateToProps, mapDispatchToProps)(Signup);

export default SignupContainer;
