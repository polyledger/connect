import { connect } from "react-redux";
import { addAlert } from "../actions/alertActions";
import { login } from "../actions/authActions";
import Login from "../components/Auth/Login/Login";

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => ({
  addAlert: (text, type, icon) => dispatch(addAlert(text, type, icon)),
  login: credentials => dispatch(login(credentials))
});

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginContainer;
